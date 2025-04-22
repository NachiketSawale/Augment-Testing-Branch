import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonTotalDataService } from '../../services/procurement-common-total-data.service';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, EntityRuntimeData, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPrcCommonReadonlyService } from '../../model/interfaces/prc-common-readonly-service.interface';
import { BasicsSharedDataValidationService, BasicsSharedTaxCodeLookupService, BasicsSharedTotalCostCompositeComponent, createCostTotalLookupProvider } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { FieldType, FormRow, IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IFormConfig, ILookupReadonlyDataService, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IGeneratePaymentSchedule } from '../../model/interfaces/wizard/generate-payment-schedule.interface';
import { ProcurementCommonGeneratePaymentScheduleValidationService } from './generate-payment-schedule-validation.service';
import { GENERATE_PAYMENT_SCHEDULE_TOKEN, GeneratePaymentScheduleConfig, ProcurementCommonGeneratePaymentScheduleComponent } from '../../components/generate-payment-schedule/procurement-common-generate-payment-schedule.component';
import { eq, filter, find, gt, isNil } from 'lodash';

/**
 * Procurement common generate payment schedule wizard service
 * @param <P> - The type of the entity identification
 * @param <U> - The type of the complete identification
 */
export abstract class ProcurementCommonGeneratePaymentScheduleWizardService<P extends IEntityIdentification, U extends CompleteIdentification<P>> extends ProcurementCommonWizardBaseService<P, U, object> {
	private readonly customDialogService = inject(UiCommonDialogService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected readonly taxCodeLookup = inject(BasicsSharedTaxCodeLookupService);
	protected readonly msgDialog = inject(UiCommonMessageBoxService);

	protected abstract selectedTotal(): { Id: number; ValueNetOc: number; GrossOc: number };

	//protected abstract generatePaymentScheduleFields: () => GeneratePaymentScheduleFields;

	protected abstract readonly validationService: ProcurementCommonGeneratePaymentScheduleValidationService;

	protected abstract readonly totalLookupService?: ILookupReadonlyDataService<object, { TotalCost: number }>;
	protected abstract readonly totalsLookupService?: ILookupReadonlyDataService<object, object>;

	protected multipleSelection = false;
	protected vatPercent: number = 0;
	protected selectedLead: P | null = null;
	protected selectedLeads: P[] | null = null;
	protected formEntity: IGeneratePaymentSchedule = {
		CodeMask: '',
		DescriptionMask: '',
		EndWork: null,
		ExchangeRate: null,
		HeaderFk: null,
		IsDelay: false,
		OcPercent: null,
		Occurence: 0,
		RadioType: '0',
		Repeat: '',
		ScurveFk: 0,
		StartWork: null,
		TotalCost: null,
		TotalOcGross: null,
		VatPercent: null,
	};
	protected formRuntimeData: EntityRuntimeData<IGeneratePaymentSchedule> | null = null;

	protected constructor(protected readonly parentService: (DataServiceHierarchicalRoot<P, U> | DataServiceFlatRoot<P, U>) & IPrcCommonReadonlyService<P>) {
		super({ rootDataService: parentService });
	}

	protected getVatPercent(selectedLead: unknown): number {
		const taxCodeFk = (selectedLead as { TaxCodeFk: number }).TaxCodeFk;

		if (taxCodeFk) {
			const taxCode = this.taxCodeLookup.cache.getItem({ id: taxCodeFk });
			if (taxCode) {
				return taxCode.VatPercent;
			}
		}
		return 0;
	}

	protected override async doExecuteWizard(opt?: object, bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok) {
		return true;
	}

	protected override async showWizardDialog() {
		this.selectedLead = this.parentService.getSelectedEntity();
		this.selectedLeads = this.parentService.getSelection();
		this.multipleSelection = this.selectedLeads && this.selectedLeads.length > 1;
		const options = this.generateDialogOptions();
		await this.beforeOpenDialogFn();
		await this.customDialogService.show(options);

		return { closingButtonId: StandardDialogButtonId.Ok };
	}

	protected generateDialogOptions() {
		if (this.selectedLead) {
			this.vatPercent = this.getVatPercent(this.selectedLead);
		}
		this.formEntity = this.getInitValue();
		return {
			headerText: 'procurement.common.wizard.generatePaymentSchedule.wizard',
			bodyComponent: ProcurementCommonGeneratePaymentScheduleComponent,
			width: '530px',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {
						key: 'ui.common.dialog.okBtn',
					},
					fn: (event, info: IClosingDialogButtonEventInfo<ICustomDialog<IGeneratePaymentSchedule, { isLoading: boolean }>, void>) => {
						return this.Ok(info);
					},
					isDisabled: (info) => {
						const entity = this.formEntity;
						// TODO: validation
						if (this.formRuntimeData && this.formRuntimeData.validationResults) {
							return true;
						}
						const isScurveFk = eq(entity.RadioType, '0') && entity.ScurveFk !== 0; // =0
						const isUserFrequence = gt(entity.RadioType, '0') && !isNil(entity.Occurence); // >0
						return !(entity.CodeMask && entity.DescriptionMask && entity.StartWork && entity.EndWork && (isScurveFk || isUserFrequence));
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: {
						key: 'ui.common.dialog.cancelBtn',
					},
				},
			],
			bodyProviders: [
				{
					provide: GENERATE_PAYMENT_SCHEDULE_TOKEN,
					useValue: {
						multipleSelection: this.multipleSelection,
						// selectedTotal: unknown;
						// allTotal: unknown;
						selectedLead: this.selectedLead,
						selectedLeads: this.selectedLeads,
						validationService: this.validationService,
						formConfig: this.getFormConfig(),
						formEntity: this.formEntity,
						entityRuntimeData: this.formRuntimeData,
					} as GeneratePaymentScheduleConfig,
				},
			],
			value: this.formEntity,
		} as ICustomDialogOptions<unknown, ProcurementCommonGeneratePaymentScheduleComponent>;
	}

	protected getTotalByConfiguration<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(totalDataService: ProcurementCommonTotalDataService<T, PT, PU>, totalList?: T[]) {
		const PrcTotalKindFk = 1;
		if (!totalList) {
			totalList = totalDataService.getList();
		}
		const totalItem = totalList.filter((totalItem) => {
			const type = totalDataService.getTotalType(totalItem);
			return type && type.PrcTotalKindFk === PrcTotalKindFk;
		});
		if (totalItem && totalItem[0]) {
			return totalItem[0];
		}
		return null;
	}

	protected getFormConfig(): IFormConfig<IGeneratePaymentSchedule> {
		return {
			formId: 'generate-payment-schedule',
			showGrouping: false,
			groups: [
				{
					groupId: 'basicData',
					header: 'procurement.common.wizard.generatePaymentSchedule.wizard',
				},
			],
			rows: [
				{
					groupId: 'basicData',
					id: 'codemask',
					label: 'procurement.common.wizard.generatePaymentSchedule.codeMask',
					type: FieldType.Description,
					model: 'CodeMask',
					required: true,
					maxLength: 16,
				},
				{
					groupId: 'basicData',
					id: 'descriptionmask',
					label: 'procurement.common.wizard.generatePaymentSchedule.descriptionMask',
					type: FieldType.Description,
					model: 'DescriptionMask',
					maxLength: 252,
				},
				this.getTotalOcNetColumn(),
				{
					groupId: 'basicData',
					id: 'totalocgross',
					label: 'procurement.common.wizard.generatePaymentSchedule.totalOcGross',
					type: this.multipleSelection ? FieldType.Description : FieldType.Money,
					model: this.multipleSelection ? 'Placeholder' : 'TotalOcGross',
					validator: this.multipleSelection ? undefined : (info) => this.validationService.validateTotalOcGross({ ...info, field: 'TotalOcGross' }),
					readonly: this.multipleSelection,
				},
				{
					groupId: 'basicData',
					id: 'startwork',
					label: 'procurement.common.wizard.generatePaymentSchedule.startDate',
					type: this.multipleSelection ? FieldType.Description : FieldType.DateUtc,
					model: this.multipleSelection ? 'Placeholder' : 'StartWork',
					readonly: this.multipleSelection,
					validator: this.multipleSelection ? undefined : (info) => this.validationService.validateStartWork({ ...info, field: 'StartWork' }),
				},
				{
					groupId: 'basicData',
					id: 'endwork',
					label: 'procurement.common.wizard.generatePaymentSchedule.endDate',
					type: this.multipleSelection ? FieldType.Description : FieldType.DateUtc,
					model: this.multipleSelection ? 'Placeholder' : 'EndWork',
					readonly: this.multipleSelection,
					validator: this.multipleSelection ? undefined : (info) => this.validationService.validateEndWork({ ...info, field: 'EndWork' }),
				},
			],
		};
	}

	protected getTotalOcNetColumn(): FormRow<IGeneratePaymentSchedule> {
		if (!this.multipleSelection) {
			return {
				groupId: 'basicData',
				id: 'totalocnet',
				label: 'procurement.common.wizard.generatePaymentSchedule.totalOcNet', // 'type': 'decimal',
				type: FieldType.CustomComponent,
				model: 'TotalCost',
				componentType: BasicsSharedTotalCostCompositeComponent,
				providers: this.totalLookupService ? [createCostTotalLookupProvider(this.totalLookupService)] : [],
				validator: (info) => this.validationService.validateTotalCost({ ...info, field: 'TotalCost' }),
			};
		} else {
			return {
				id: 'multipleTotalType',
				groupId: 'basicData',
				label: 'procurement.common.wizard.generatePaymentSchedule.totalOcNet',
				type: FieldType.CustomComponent,
				model: 'MultipleTotalType',
				componentType: BasicsSharedTotalCostCompositeComponent,
				providers: this.totalsLookupService ? [createCostTotalLookupProvider(Object.assign(this.totalsLookupService, { placeHolder: '***' }))] : [],
				validator: async (info) => this.getAsyncalidateMultipleTotalType({ ...info, field: 'TotalCost' }),
				// 'directive': 'prc-common-multiple-total-type-composite',
				// 'options': {
				// 	'lookupDirective': params.moduleName === 'procurement.contract' ? 'contracts-total-drop-down' :
				// 		'packages-total-drop-down'
				// }
			};
		}
	}

	protected abstract getTotalPromise(): Promise<IPrcCommonTotalEntity[] | undefined> | undefined;

	//
	protected getAsyncalidateMultipleTotalType(info: ValidationInfo<IGeneratePaymentSchedule>): Promise<ValidationResult> {
		const totalNetMsg = this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.mustSelectSourceOfTotalOcNet', { totalOcNet: this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet') });

		if (info.value) {
			const value = info.value as number;
			const promise = this.getTotalPromise();

			if (promise) {
				return promise.then((list) => {
					if (list && list.length) {
						const sameKindTotals = filter(list, { TotalKindFk: value });
						if (sameKindTotals && sameKindTotals.length) {
							let codeStr = '';
							sameKindTotals.forEach((s) => {
								if (!s.ValueNetOc) {
									const leadEntity = find(this.selectedLeads, { Id: s.HeaderFk }) as unknown as Record<string, string>;
									if (leadEntity) {
										codeStr += codeStr === '' ? leadEntity['Code'] : ',' + leadEntity['Code'];
									}
								}
							});
							if (codeStr === '') {
								return Promise.resolve(new ValidationResult());
							} else {
								let msg = this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.noZero').text;
								msg +=
									', ' +
									this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.valueInPackagesIsZero', {
										code: codeStr,
									}).text;
								return Promise.resolve(this.validationUtils.createErrorObject(msg));
							}
						}
						return Promise.resolve(new ValidationResult());
					} else {
						return Promise.resolve(this.validationUtils.createErrorObject(totalNetMsg));
					}
				});
			}
		}
		return Promise.resolve(this.validationUtils.createErrorObject(totalNetMsg));
	}

	protected getInitValue() {
		const selectedTotal = this.selectedTotal() || { Id: 0, ValueNetOc: 0, GrossOc: 0 };
		const defaultTotal = {
			Id: selectedTotal.Id,
			ValueNetOc: selectedTotal.ValueNetOc,
			GrossOc: selectedTotal.GrossOc,
		};

		const result: IGeneratePaymentSchedule = {
			ScurveFk: 0,
			CodeMask: '##',
			DescriptionMask: 'Payment-##',
			TotalCost: defaultTotal ? defaultTotal.ValueNetOc : null,
			TotalOcGross: defaultTotal ? defaultTotal.GrossOc : null,
			StartWork: null,
			EndWork: null,
			ExchangeRate: null,
			HeaderFk: null,
			VatPercent: this.vatPercent,
			IsDelay: false,
			OcPercent: 1,
			RadioType: '0', // 0: sCurve,1:userFrequence
			Repeat: '1',
			Occurence: 0,
		};
		if (this.multipleSelection && this.selectedLeads) {
			const ids = this.selectedLeads.map((p) => {
				return p.Id;
			});
			ids.sort();
			result.Ids = ids;
			result.MultipleTotalType = -1;
		}
		return result;
	}

	protected async beforeOpenDialogFn() {}

	protected abstract Ok(info: IClosingDialogButtonEventInfo<ICustomDialog<IGeneratePaymentSchedule, { isLoading: boolean }>, void>): void;

	protected ocPercent() {
		if (!this.formEntity.TotalCost || !this.formEntity.TotalOcGross || this.formEntity.TotalCost === 0 || this.formEntity.TotalOcGross === 0) {
			return 0;
		} else {
			return parseFloat((this.formEntity.TotalOcGross / this.formEntity.TotalCost).toString());
		}
	}

	protected async showSuccessDialog() {
		const bodyText = this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.message');
		const header = this.translateService.instant('procurement.common.wizard.generatePaymentSchedule.wizard');
		await this.msgDialog.showMsgBox(bodyText.text, header.text, 'info');
	}
}
