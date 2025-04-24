import { Component, inject, InjectionToken } from '@angular/core';
import { createLookup, FieldType, FieldValidationInfo, getCustomDialogDataToken, IFormConfig, StandardDialogButtonId } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import {
	BasicsSharedDataValidationService,
	BasicsSharedInvoiceTypeLookupService,
	BasicsSharedNumberGenerationService,
	BasicsSharedProcurementConfigurationLookupService,
	ProcurementConfigurationEntity,
	Rubric
} from '@libs/basics/shared';
import { HttpClient } from '@angular/common/http';
import { flatten, get, groupBy, mapValues, minBy, uniq } from 'lodash';
import { IBasicsCustomizeInvoiceTypeEntity } from '@libs/basics/interfaces';
import { IPesHeaderEntity } from '../../model/entities';
import { IInvoiceCreateParam, IPESCreateInvoiceWizardData, PESCreateInvoiceOption } from '../../wizards/procurement-pes-create-invoice.service';
import { IContractLookupEntity } from '@libs/procurement/shared';
import { EntityRuntimeData, ValidationInfo, ValidationResult } from '@libs/platform/data-access';

export enum InvoiceCreateWizardPage {
	options = 1,
	invoiceConfigure,
}

/**
 * injection token pes create invoice wizard data
 */
export const PES_CREATE_INVOICE_WIZARD_TOKEN = new InjectionToken<IPESCreateInvoiceWizardData>('PES_CREATE_INVOICE_WIZARD_TOKEN');

@Component({
	selector: 'procurement-pes-create-invoice-wizard',
	templateUrl: './procurement-pes-create-invoice-wizard.component.html',
	styleUrl: './procurement-pes-create-invoice-wizard.component.css',
})
export class ProcurementPesCreateInvoiceWizardComponent {
	private readonly numberGenerationService = inject(BasicsSharedNumberGenerationService);
	private readonly invoiceTypeLookupService = inject(BasicsSharedInvoiceTypeLookupService);
	private readonly prcConfigureLookupService = inject(BasicsSharedProcurementConfigurationLookupService);

	protected readonly wizardData = inject(PES_CREATE_INVOICE_WIZARD_TOKEN);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly PESCreateInvoiceOption = PESCreateInvoiceOption;
	protected readonly InvoiceCreateWizardPage = InvoiceCreateWizardPage;
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	private readonly dialogWrapper = inject(getCustomDialogDataToken<IInvoiceCreateParam[], ProcurementPesCreateInvoiceWizardComponent>());

	private invoiceTypes: IBasicsCustomizeInvoiceTypeEntity[] = [];
	private invoiceCreateGroupingData: {
		formConfig: IFormConfig<IInvoiceCreateParam>;
		param: IInvoiceCreateParam;
		contractCode?: string;
	}[] = [];

	public currentPage: InvoiceCreateWizardPage = InvoiceCreateWizardPage.options;
	private invoiceGroupIndex = 0;

	public get warningMessage() {
		return this.wizardData.pesForSkip.length > 0
			? this.translateService.instant('procurement.pes.wizard.cannotCreateInvForStatus', {
				pesCode: this.wizardData.pesForSkip.map((i) => i.Code).join(','),
			}).text
			: '';
	}

	public async onNextBntClicked() {
		switch (this.currentPage) {
			case InvoiceCreateWizardPage.options:
				await this.initialInvoiceConfigPagesByCreateOption();
				this.currentPage = InvoiceCreateWizardPage.invoiceConfigure;
				this.invoiceGroupIndex = 0;
				break;
			case InvoiceCreateWizardPage.invoiceConfigure: {
				this.invoiceGroupIndex += 1;
				break;
			}
		}

		this.updateDialogHeaderText();
	}

	private updateDialogHeaderText() {
		let headerText = this.translateService.instant('procurement.pes.wizard.createInvoiceCaption').text;

		if (this.currentPage === InvoiceCreateWizardPage.invoiceConfigure) {
			headerText = headerText + ` ${this.invoiceGroupIndex + 1}/${this.invoiceCreateGroupingData.length}`;
			switch (this.wizardData.createOption) {
				case PESCreateInvoiceOption.one2One:
					headerText += this.translateService.instant('procurement.pes.wizard.createInvoice.one2OneHeader', {pesCode: this.currentFormData.pesEntities[0].Code}).text;
					break;
				case PESCreateInvoiceOption.one2SameContract:
					headerText += this.translateService.instant('procurement.pes.wizard.createInvoice.one2SameContract', {conCode: this.invoiceCreateGroupingData[this.invoiceGroupIndex].contractCode}).text;
					break;
			}
		}

		this.dialogWrapper.headerText = headerText;
	}

	public nextBtnDisabled() {
		return this.currentPage === InvoiceCreateWizardPage.invoiceConfigure && this.invoiceGroupIndex === this.invoiceCreateGroupingData.length - 1;
	}

	public get currentFormConfig() {
		return this.invoiceCreateGroupingData[this.invoiceGroupIndex].formConfig;
	}

	public get currentFormData() {
		return this.invoiceCreateGroupingData[this.invoiceGroupIndex].param;
	}

	public get currentEntityRuntimeData() {
		return this.invoiceCreateGroupingData[this.invoiceGroupIndex].param.RuntimeData;
	}

	public backBtnVisible() {
		return this.currentPage !== InvoiceCreateWizardPage.options;
	}

	public onBackBtnClicked() {
		if (this.invoiceGroupIndex === 0) {
			this.currentPage = InvoiceCreateWizardPage.options;
			this.wizardData.invoiceCreateInfo = [];
		} else {
			this.invoiceGroupIndex -= 1;
		}

		this.updateDialogHeaderText();
	}

	public okBtnDisabled() {
		return this.currentPage === InvoiceCreateWizardPage.options || this.invoiceGroupIndex < this.invoiceCreateGroupingData.length - 1 || this.hasValidationErrors();
	}

	private get isAllPesWithoutContract(): boolean {
		return this.wizardData.pesForCreate.every(e => !e.ConHeaderFk);
	}

	private get isAllPesWithContract(): boolean {
		return this.wizardData.pesForCreate.every(e => e.ConHeaderFk);
	}

	private get isSelectMultiplePes(): boolean {
		return this.wizardData.pesForCreate.length > 1;
	}

	public one2SameContractOptionDisabled() {
		return !this.isSelectMultiplePes || this.isAllPesWithoutContract;
	}

	public one2AllDisabled() {
		return !this.isSelectMultiplePes || !this.isMultiplePesCanCreateOneInvoice();
	}

	private async initialInvoiceConfigPagesByCreateOption() {
		await this.numberGenerationService.getNumberGenerateConfig('procurement/invoice/numbergeneration/list');
		const pesConfigurationFks = this.wizardData.pesForCreate.map((i) => i.PrcConfigurationFk);
		const invoiceConfigMap = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/invoice/header/getConifForCreateInvFromPes', pesConfigurationFks));
		this.invoiceTypes = await firstValueFrom(this.invoiceTypeLookupService.getList());
		const initialInvoiceConfigurePromises: Promise<void>[] = [];
		this.invoiceCreateGroupingData = [];

		switch (this.wizardData.createOption) {
			case PESCreateInvoiceOption.one2One: {
				this.wizardData.pesForCreate.forEach((entity) => {
					initialInvoiceConfigurePromises.push(this.initialInvoiceConfigure([entity], get(invoiceConfigMap, entity.PrcConfigurationFk)));
				});
				break;
			}
			case PESCreateInvoiceOption.one2SameContract: {
				const contractForPes = this.wizardData.conHeadersForPes;
				const groups = groupBy(this.wizardData.pesForCreate, (i) => i.ConHeaderFk);
				mapValues(groups, (entities, contractKf: number) => {
					initialInvoiceConfigurePromises.push(
						this.initialInvoiceConfigure(
							entities,
							get(invoiceConfigMap, entities[0].PrcConfigurationFk),
							contractForPes.find((con) => con.Id === contractKf),
						),
					);
				});
				break;
			}
			case PESCreateInvoiceOption.one2All:
				initialInvoiceConfigurePromises.push(this.initialInvoiceConfigure(this.wizardData.pesForCreate, get(invoiceConfigMap, this.wizardData.pesForCreate[0].PrcConfigurationFk)));
		}

		return Promise.all(initialInvoiceConfigurePromises);
	}

	private getDefaultInvoiceType(rubricCategoryId: number): IBasicsCustomizeInvoiceTypeEntity | null {
		const matchInvoiceTypes = this.invoiceTypes.filter((type) => type.RubricCategoryFk === rubricCategoryId);
		let defaultInvoiceType = matchInvoiceTypes.find((type) => type.IsDefault);
		defaultInvoiceType = defaultInvoiceType ?? minBy(matchInvoiceTypes, (type) => type.Id);

		if (!defaultInvoiceType) {
			return null;
		}

		return defaultInvoiceType;
	}

	private async validatePrcConfigureFk(info: FieldValidationInfo<IInvoiceCreateParam>): Promise<ValidationResult> {
		const entity = info.entity;
		const newPrcConfigureFk = info.value as number;
		const field = 'PrcConfigureFk';

		if (info.value) {
			const config = await firstValueFrom(this.prcConfigureLookupService.getItemByKey({id: newPrcConfigureFk}));
			const updateInvoiceResult = await this.updateInvoiceTypeByPrcConfigure(config, entity);
			if (!updateInvoiceResult.valid) {
				entity.RuntimeData.validationResults.push({field: field, result: updateInvoiceResult});
				return updateInvoiceResult;
			}
			entity.PrcConfigHeaderFk = config.PrcConfigHeaderFk;
			this.updateCodeByRubricCategoryId(config.RubricCategoryFk, entity);
		}

		entity.RuntimeData.validationResults = entity.RuntimeData.validationResults.filter(r => r.field !== field);
		return this.validationUtils.createSuccessObject();
	}

	private async initialInvoiceConfigure(pesEntities: IPesHeaderEntity[], invoiceConfig?: ProcurementConfigurationEntity, contract?: IContractLookupEntity) {
		if (!invoiceConfig) {
			throw new Error('There should be a mapped invoice configure');
		}

		const invoiceParam = {
			pesEntities: pesEntities,
			Reference: '',
			Code: '',
			PrcConfigFk: invoiceConfig.Id,
			InvTypeFk: 0, //Just initialize the typeFk. It will change in the function updateInvoiceConfigure
			DateInvoiced: new Date(),
			RubricCategoryFk: invoiceConfig.RubricCategoryFk,
			PrcConfigHeaderFk: invoiceConfig.PrcConfigHeaderFk,
			ConHeaderFk: contract?.Id,
			RuntimeData: new EntityRuntimeData<IInvoiceCreateParam>()
		};

		await this.validatePrcConfigureFk({value: invoiceConfig.Id, entity: invoiceParam});

		//TODO: Initial the validation. Not sure there are better solution in the future support from framework.
		this.validateMandatory({entity: invoiceParam, value: invoiceParam.Reference}, 'Reference');
		this.validateMandatory({entity: invoiceParam, value: invoiceParam.Code}, 'Code');

		this.invoiceCreateGroupingData.push({
			contractCode: contract?.Code,
			formConfig: {
				formId: 'pes.wizard.createInvoice',
				showGrouping: false,
				rows: [
					{
						id: 'InvoiceNo',
						label: 'procurement.invoice.header.reference',
						type: FieldType.Code,
						model: 'Reference',
						required: true,
						sortOrder: 1,
						validator: (info) => {
							const field = 'Reference';
							info.entity[field] = info.value as string;
							return this.validateMandatory(info, field);
						},
					},
					{
						id: 'InvoiceCode',
						label: 'procurement.invoice.header.code',
						type: FieldType.Code,
						model: 'Code',
						required: true,
						sortOrder: 2,
						validator: (info) => {
							const field = 'Code';
							info.entity[field] = info.value as string;
							return this.validateMandatory(info, field);
						},
					},
					{
						id: 'PrcConfigFk',
						label: 'procurement.invoice.header.configuration',
						type: FieldType.Lookup,
						model: 'PrcConfigFk',
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedProcurementConfigurationLookupService<IInvoiceCreateParam>,
							serverSideFilter: {
								key: 'pes-create-invoice-configuration-filter',
								execute: (context) => {
									return `RubricFk=${Rubric.Invoices} And PrcConfigHeaderFk=${context.entity?.PrcConfigHeaderFk}`;
								},
							},
						}),
						validator: (info) => {
							return this.validatePrcConfigureFk(info);
						},
						sortOrder: 3,
					},
					{
						id: 'InvTypeFk',
						label: 'cloud.common.entityType',
						type: FieldType.Lookup,
						model: 'InvTypeFk',
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedInvoiceTypeLookupService<IInvoiceCreateParam>,
							serverSideFilter: {
								key: 'pes-create-invoice-invType-filter',
								execute: (context) => {
									return `Sorting>0 And RubricCategoryFk=${context.entity?.RubricCategoryFk}`;
								},
							},
						}),
						sortOrder: 4,
					},
					{
						id: 'DateInvoiced',
						label: 'procurement.invoice.header.dateInvoiced',
						type: FieldType.DateUtc,
						model: 'DateInvoiced',
						sortOrder: 5
					},
				],
			},
			param: invoiceParam,
		});
	}

	private validateMandatory(info: FieldValidationInfo<IInvoiceCreateParam>, fieldName: keyof IInvoiceCreateParam) {
		const entity = info.entity;
		const result = this.validationUtils.isMandatory(new ValidationInfo<IInvoiceCreateParam>(info.entity, info.value, fieldName));

		if (result.valid) {
			entity.RuntimeData.validationResults = entity.RuntimeData.validationResults.filter(r => r.field !== fieldName);
		} else {
			entity.RuntimeData.validationResults.push({field: fieldName, result: result});
		}

		return result;
	}

	public onOkBtnClicked() {
		this.dialogWrapper.value = this.invoiceCreateGroupingData.map(data => data.param);
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	private isMultiplePesCanCreateOneInvoice() {
		if (this.isAllPesWithoutContract) {
			return this.isSameProvidedProperties([
				'CompanyFk', 'BusinessPartnerFk', 'ProjectFk',
				'PackageFk', 'ControllingUnitFk', 'PrcStructureFk'
			]);
		} else if (this.isAllPesWithContract) {
			return this.isSameProvidedProperties(['CompanyFk']) && this.isFromSameConHeader();
		}

		return false;
	}

	private isSameProvidedProperties(properties: Partial<keyof IPesHeaderEntity>[]) {
		const pesHeaders = this.wizardData.pesForCreate;
		return properties.every(p => {
			const values = pesHeaders.map(e => e[p]);
			return uniq(values).length === 1;
		});
	}

	private isFromSameConHeader() {
		const baseContracts = this.wizardData.conHeadersForPes.map(e => (e.ConHeaderFk ?? e.Id));
		return uniq(baseContracts).length === 1;
	}

	private async updateInvoiceTypeByPrcConfigure(config: ProcurementConfigurationEntity, invoiceParam: IInvoiceCreateParam): Promise<ValidationResult> {
		const defaultInvoiceType = this.getDefaultInvoiceType(config.RubricCategoryFk);

		if (defaultInvoiceType) {
			invoiceParam.InvTypeFk = defaultInvoiceType.Id;
			return this.validationUtils.createSuccessObject();
		}

		return this.validationUtils.createErrorObject({
			key: 'procurement.pes.wizard.noAvailableInvoiceType',
			params: {rubricCategoryId: config.RubricCategoryFk}
		});
	}

	private updateCodeByRubricCategoryId(rubricCategoryId: number, invoiceParam: IInvoiceCreateParam) {
		let invoiceCode = '';
		const codeField = 'Code';

		invoiceParam.RuntimeData.readOnlyFields = invoiceParam.RuntimeData.readOnlyFields.filter(r => r.field !== codeField);
		if (this.numberGenerationService.hasNumberGenerateConfig(rubricCategoryId)) {
			invoiceCode = this.numberGenerationService.provideNumberDefaultText(rubricCategoryId);
			invoiceParam.RuntimeData.readOnlyFields.push({field: codeField, readOnly: true});
		}

		invoiceParam.Code = invoiceCode;
	}

	private hasValidationErrors(): boolean {
		const validationResults = flatten(this.invoiceCreateGroupingData.map(d => d.param.RuntimeData.validationResults));
		const validateFails = validationResults.filter(r => !r.result.valid);
		return !!(validateFails?.length);
	}
}