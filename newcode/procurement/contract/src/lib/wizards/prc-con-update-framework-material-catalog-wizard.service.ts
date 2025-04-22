/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import {
	BasicsSharedClerkLookupService,
	BasicsSharedDataValidationService,
	BasicsSharedMaterialCatalogLookupService,
	BasicsSharedMaterialCatalogTypeLookupService,
	BasicsSharedPaymentTermLookupService,
	BasicsSharedPrcIncotermLookupService,
	BasicsSharedRubricCategoryLookupService,
	Rubric,
} from '@libs/basics/shared';
import { createLookup, FieldType, IFormDialogConfig, StandardDialogButtonId } from '@libs/ui/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';

interface ICreateUpdateFRMMaterialCatalogOptions {
	ConHeaderFk?: number | null;
	PrcHeaderFk?: number;
	Code?: string;
	MaterialCatalogFk?: number | null;
	Description?: string | null;
	MaterialCatalogTypeFk?: number;
	BasRubricCategoryFk?: number;
	ValidFrom?: Date | string | null;
	ValidTo?: Date | string | null;
	PaymentTermFiFk?: number | null;
	PaymentTermAdFk?: number | null;
	PaymentTermFk?: number;
	PrcIncotermFk?: number;
	ClerkFk?: number;
	hasCreate?: string;
}

enum CreateFRMMaterialCatalogButtons {
	create = 'createButton',
	update = 'updateButton',
}

@Injectable({
	providedIn: 'root',
})
export class PrcConUpdateFrameWorkMaterialCatalogWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, ICreateUpdateFRMMaterialCatalogOptions> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly materialCatalogLookupService = inject(BasicsSharedMaterialCatalogLookupService);

	private entityContext: ICreateUpdateFRMMaterialCatalogOptions = {
		hasCreate: CreateFRMMaterialCatalogButtons.create,
	};
	private formRuntimeInfo: EntityRuntimeData<ICreateUpdateFRMMaterialCatalogOptions> = {
		readOnlyFields: [{ field: 'PaymentTermFiFk', readOnly: true }], //todo-readOnlyFields seems not work. May need to create a ticket to framework team.
		validationResults: [],
		entityIsReadOnly: false,
	};

	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
		});
	}

	protected override async getFormDialogConfig(): Promise<IFormDialogConfig<ICreateUpdateFRMMaterialCatalogOptions>> {
		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity) {
			const entity = {
				ConHeaderFk: selEntity.Id,
				PrcHeaderFk: selEntity.PrcHeaderFk,
				ValidFrom: selEntity.ValidFrom ? new Date(selEntity.ValidFrom) : undefined,
				ValidTo: selEntity.ValidTo ? new Date(selEntity.ValidTo) : undefined,
				PaymentTermPaFk: selEntity.PaymentTermPaFk,
				ClerkPrcFk: selEntity.ClerkPrcFk,
				PaymentTermFiFk: selEntity.PaymentTermFiFk ?? undefined,
				PaymentTermAdFk: selEntity.PaymentTermAdFk ?? undefined,
				hasCreate: CreateFRMMaterialCatalogButtons.create,
			};
			this.entityContext = entity;
			return {
				id: 'create-wic-dialog',
				headerText: {
					text: this.translateService.instant('procurement.contract.createWicCatalog').text,
				},
				entity: entity,
				runtime: this.formRuntimeInfo,
				formConfiguration: {
					formId: 'updateFrameworkMaterialCatalogWizard',
					showGrouping: false,
					rows: [
						{
							id: 'hasCreate',
							model: 'hasCreate',
							type: FieldType.Radio,
							required: true,
							label: {
								key: 'procurement.common.boq.wicGroup',
							},
							change: (changeInfo) => {
								this.validateIsCreate(changeInfo.entity);
							},
							itemsSource: {
								items: [
									{
										id: CreateFRMMaterialCatalogButtons.create,
										displayName: 'procurement.contract.updateFrameworkMaterialCatalog.newCatalog',
									},
									{
										id: CreateFRMMaterialCatalogButtons.update,
										displayName: 'procurement.contract.updateFrameworkMaterialCatalog.existedCatalog',
									},
								],
							},
						},
						{
							id: 'materialCatalogFk',
							model: 'MaterialCatalogFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedMaterialCatalogLookupService,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityCode',
							},
							change: (changeInfo) => {
								this.validateMaterialCatalog(changeInfo.entity);
							},
							visible: !this.isCreate(), //todo-Dynamic data should be support,current only support string value
						},
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							required: true,
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityCode',
							},
							visible: this.isCreate(),
							change: (changeInfo) => {
								this.validateCode(changeInfo.entity);
							},
						},
						{
							type: FieldType.Description,
							id: 'Description',
							model: 'Description',
							label: { key: 'procurement.contract.updateFrameworkMaterialCatalog.entityDescription' },
							visible: true,
							readonly: !this.isCreate(),
						},
						{
							id: 'materialCatalogTypeFk',
							model: 'MaterialCatalogTypeFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedMaterialCatalogTypeLookupService,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityMaterialCatalogTypeFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'basRubricCategoryFk',
							model: 'BasRubricCategoryFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedRubricCategoryLookupService,
								serverSideFilter: {
									key: 'mdc-material-catalog-rubric-category-filter',
									execute() {
										return 'RubricFk = ' + Rubric.Material;
									},
								},
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityBasRubricCategoryFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'validFrom',
							model: 'ValidFrom',
							type: FieldType.Date,
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityValidFrom',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'validTo',
							model: 'ValidTo',
							type: FieldType.Date,
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityValidTo',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'paymentTermFk',
							model: 'PaymentTermFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPaymentTermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermPaFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'paymentTermFiFk',
							model: 'PaymentTermFiFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPaymentTermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermFiFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'paymentTermAdFk',
							model: 'PaymentTermAdFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPaymentTermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermAdFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'prcIncotermFk',
							model: 'PrcIncotermFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPrcIncotermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPrcIncotermFk',
							},
							readonly: !this.isCreate(),
						},
						{
							id: 'clerkFk',
							model: 'ClerkFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedClerkLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityClerkFk',
							},
							readonly: !this.isCreate(),
						},
					],
				},
				showOkButton: true,
			};
		}
		throw new Error('Should have selected entity');
	}

	protected override async doExecuteWizard(opt: ICreateUpdateFRMMaterialCatalogOptions, bntId: StandardDialogButtonId | string) {
		if (bntId === StandardDialogButtonId.Ok) {
			const responseData = await this.http.post('basics/materialcatalog/catalog/updatefromcontract', opt);

			const updatedData = responseData as ICreateUpdateFRMMaterialCatalogOptions;
			const requestParam = {
				ConHeaderFk: this.entityContext.ConHeaderFk,
				MaterialCatalogFk: updatedData.MaterialCatalogFk,
				PaymentTermPaFk: updatedData.PaymentTermFk,
				PaymentTermFiFk: updatedData.PaymentTermFiFk,
				PaymentTermAdFk: updatedData.PaymentTermAdFk,
			};

			await this.http.post('procurement/contract/header/setisframework', requestParam);

			await this.wizardUtilService.showGoToMsgBox(
				this.translateService.instant('procurement.contract.updateFrameworkMaterialCatalog.successText').text,
				this.translateService.instant('procurement.contract.updateFrameworkMaterialCatalog.headerText').text,
				opt.MaterialCatalogFk as unknown as IIdentificationData[],
				ProcurementInternalModule.Contract,
			);
		}
		return false;
	}

	private async validateIsCreate(opts: ICreateUpdateFRMMaterialCatalogOptions) {
		if (opts) {
			this.entityContext.hasCreate = opts.hasCreate;
		}
	}

	private async validateMaterialCatalog(opts: ICreateUpdateFRMMaterialCatalogOptions) {
		const mdcCatalog = await firstValueFrom(this.materialCatalogLookupService.getItemByKey({ id: opts.MaterialCatalogFk! }));
		if (mdcCatalog) {
			opts.Code = mdcCatalog.Code;
			opts.Description = mdcCatalog.DescriptionInfo.Translated;
			opts.MaterialCatalogTypeFk = mdcCatalog.MaterialCatalogTypeFk;
			opts.BasRubricCategoryFk = mdcCatalog.BasRubricCategoryFk;
			opts.ValidFrom = mdcCatalog.ValidFrom;
			opts.ValidTo = mdcCatalog.ValidTo;
			opts.PaymentTermAdFk = mdcCatalog.PaymentTermAdFk;
			opts.PaymentTermFiFk = mdcCatalog.PaymentTermFiFk;
			opts.PaymentTermFk = mdcCatalog.PaymentTermFk;
			opts.PrcIncotermFk = mdcCatalog.IncotermFk;
			opts.ClerkFk = mdcCatalog.ClerkFk;
		}
	}

	private async validateCode(opts: ICreateUpdateFRMMaterialCatalogOptions) {
		//todo-This method is triggered every time a character is entered, and should be optimized to be triggered when switching fields
		const params = {
			code: opts.Code!
		};
		const responseData = this.http.get('basics/materialcatalog/catalog/isunique', { params });
		if (!responseData) {
			//todo- framework doesn't seem to support disable the OK button
			this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage' });
		}
	}

	private isCreate(): boolean {
		return this.entityContext.hasCreate === CreateFRMMaterialCatalogButtons.create;
	}
}