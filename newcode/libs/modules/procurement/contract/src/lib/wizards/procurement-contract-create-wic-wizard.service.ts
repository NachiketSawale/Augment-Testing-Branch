/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { BasicsSharedClerkLookupService, BasicsSharedPaymentTermLookupService, BasicsSharedWICTypeLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId } from '@libs/ui/common';
import { ProcurementSharePrcRootBoQItemLookupService } from '@libs/procurement/shared';
import { BoqWicGroupLookupService } from '@libs/boq/wic';
import { IWicBoqCompositeEntity, IBoqItemEntity, IWicBoqEntity } from '@libs/boq/interfaces';
import { firstValueFrom } from 'rxjs';

interface ICreateWICOptions {
	WicCatBoqId?: number;
	WicGroupFk?: number;
	ConHeaderFk?: number;
	ConBoqItemFk?: number;
	WicTypeFk?: number;
	ValidFrom?: Date;
	ValidTo?: Date;
	PaymentTermPaFk?: number | null;
	ClerkPrcFk?: number | null;
	PaymentTermFiFk?: number | null;
	PaymentTermAdFk?: number | null;
	hasCreatedWicBoQ: boolean;
	canUpdateWicBoqFromContract:boolean;
}

enum CreateWICWizardButtons {
	create = 'createButton',
	update = 'updateButton',
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractCreateWicWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, ICreateWICOptions> {
	private readonly  wicTypeLookupService = inject(BasicsSharedWICTypeLookupService<IWicBoqCompositeEntity>);
	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
		});
	}

	protected override async startWizardValidate() {
		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity) {
			//TODO: 2 things need to be enhance.
			// 1. currently the call will throw exception. But actually should just return a boolean value and show the message dialog. It is not a real exception
			// 2. Should merge with the other wizard to create wic from contract. Should not always have such checking.
			/*await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'procurement/contract/wizard/checkprcboq', {
				params: {
					conHeaderFk: selEntity.Id
				}
			}));*/
			return true;
		}
		return super.startWizardValidate();
	}

	protected override async getFormDialogConfig(): Promise<IFormDialogConfig<ICreateWICOptions> | null> {
		const selEntity = this.config.rootDataService.getSelectedEntity();
		const canShowDialog =  await this.http.get('procurement/contract/wizard/checkprcboq?conHeaderFk=' + selEntity!.Id);
		if (!canShowDialog && selEntity) {
			return {
				id: 'create-wic-dialog',
				headerText: {
					text: this.translateService.instant('procurement.contract.createWicCatalog').text,
				},
				entity: {
					ConHeaderFk: selEntity.Id,
					ValidFrom: selEntity.ValidFrom ? new Date(selEntity.ValidFrom) : undefined,
					ValidTo: selEntity.ValidTo ? new Date(selEntity.ValidTo) : undefined,
					PaymentTermPaFk: selEntity.PaymentTermPaFk,
					ClerkPrcFk: selEntity.ClerkPrcFk,
					PaymentTermFiFk: selEntity.PaymentTermFiFk,
					PaymentTermAdFk: selEntity.PaymentTermAdFk,
					hasCreatedWicBoQ: false,
					canUpdateWicBoqFromContract: false,
					ConBoqItemFk: await this.getConBoqItemFk(selEntity),
					WicTypeFk: await this.getDefaultWicTypeFk()
				},
				formConfiguration: {
					formId: 'updateFrameworkMaterialCatalogWizard',
					showGrouping: false,
					rows: [
						{
							id: 'wicGroup',
							model: 'WicGroupFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BoqWicGroupLookupService,
							}),
							label: {
								key: 'procurement.common.boq.wicGroup',
							},
							change: (changeInfo) => {
								this.updateWizardBySelectedWiCGroup(changeInfo.entity);
							},
						},
						{
							id: 'conBoqItemFk',
							model: 'ConBoqItemFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: ProcurementSharePrcRootBoQItemLookupService,
								serverSideFilter: {
									key: 'test',
									execute: (context) => {
										return {
											PKey1: -1,//todo-may need to enhance the server side call
											PKey2: selEntity.Id,
										};
									},
								},
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.targetWicBoq',
							},
						},
						{
							id: 'wiccatboq.mdcwictypefk',
							model: 'WicTypeFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedWICTypeLookupService,
							}),
							label: {
								key: 'basics.customize.wictype',
							},
						},
						{
							id: 'validFrom',
							model: 'ValidFrom',
							type: FieldType.Date,
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityValidFrom',
							},
						},
						{
							id: 'validTo',
							model: 'ValidTo',
							type: FieldType.Date,
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityValidTo',
							},
						},
						{
							id: 'paymentTermPaFk',
							model: 'PaymentTermPaFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPaymentTermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermPaFk',
							},
						},
						{
							id: 'paymentTermFiFk',
							model: 'PaymentTermFiFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedPaymentTermLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityPaymentTermFiFk',
							},
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
						},
						{
							id: 'clerkFk',
							model: 'ClerkPrcFk',
							type: FieldType.Lookup,
							required: true,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedClerkLookupService,
								showClearButton: true,
							}),
							label: {
								key: 'procurement.contract.updateFrameworkMaterialCatalog.entityClerkFk',
							},
						},
					],
				},
				showOkButton: false,
				customButtons: [
					{
						id: CreateWICWizardButtons.update,
						caption: this.translateService.instant('procurement.common.updateBtn').text,
						isDisabled: (info) => {
							return !info.dialog.value!.canUpdateWicBoqFromContract;
						},
					},
					{
						id: CreateWICWizardButtons.create,
						caption: this.translateService.instant('procurement.common.createBtn').text,
						isDisabled: (info) => {
							return !info.dialog.value!.hasCreatedWicBoQ;
						},
					},
				],
			};
		}
		return null;
	}

	protected override isExecuteButtonClicked(result: IEditorDialogResult<ICreateWICOptions> | undefined): boolean {
		return result?.closingButtonId === CreateWICWizardButtons.create || result?.closingButtonId === CreateWICWizardButtons.update;
	}

	protected override async doExecuteWizard(opt: ICreateWICOptions, bntId: StandardDialogButtonId | string) {
		if (bntId === CreateWICWizardButtons.update) {
			//If the WIC BoQ is created then this button should work as update. If the WIC BoQ is not created then should work as create.
			await this.http.post( 'procurement/contract/wizard/updatewiccatalog', {
					...opt,
				});

			this.messageBoxService.showMsgBox(
				//TODO: in angularJs the message is also shown as create Successfully. Maybe changed to update successfully will be better.
				this.translateService.instant('procurement.common.createSuccessfully').text,
				this.translateService.instant('procurement.contract.createWicCatalog').text,
				'ico-info',
			);

			return true;
		} else if (bntId === CreateWICWizardButtons.create) {
			//If the WIC BoQ is created then this button should work as update. If the WIC BoQ is not created then should work as create.
			await this.http.post('procurement/contract/wizard/createwiccatalog', {
					...opt,
				});

			this.messageBoxService.showMsgBox(this.translateService.instant('procurement.common.createSuccessfully').text, this.translateService.instant('procurement.contract.createWicCatalog').text, 'ico-info');

			return true;
		}

		return false;
	}

	private async updateWizardBySelectedWiCGroup(opts: ICreateWICOptions) {
		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity && opts.WicGroupFk && opts.ConBoqItemFk) {
			const resp = await this.http.get<{ WicCatBoq: IWicBoqEntity }>('boq/wic/boq/canupdatewicboqfromcontract', {
					params: { wicGroupId: opts.WicGroupFk, conBoqItemId: opts.ConBoqItemFk },
				});
			opts.hasCreatedWicBoQ = (opts.WicGroupFk! > 0 && opts.WicTypeFk! > 0);
			if (resp) {
				opts.canUpdateWicBoqFromContract = true;
				opts.WicTypeFk = resp.WicCatBoq.MdcWicTypeFk ? resp.WicCatBoq.MdcWicTypeFk : undefined;
				opts.ValidFrom = resp.WicCatBoq.ValidFrom ? resp.WicCatBoq.ValidFrom : undefined;
				opts.ValidTo = resp.WicCatBoq.ValidTo ? resp.WicCatBoq.ValidTo : undefined;
				opts.PaymentTermPaFk = resp.WicCatBoq.BasPaymentTermFk ? resp.WicCatBoq.BasPaymentTermFk : undefined;
				opts.PaymentTermAdFk = resp.WicCatBoq.BasPaymentTermAdFk ? resp.WicCatBoq.BasPaymentTermAdFk : undefined;
				opts.PaymentTermFiFk = resp.WicCatBoq.BasPaymentTermFiFk ? resp.WicCatBoq.BasPaymentTermFiFk : undefined;
				opts.ClerkPrcFk = resp.WicCatBoq.BasClerkFk ? resp.WicCatBoq.BasClerkFk : undefined;
			} else {
				opts.canUpdateWicBoqFromContract = false;
				opts.ValidFrom = selEntity.ValidFrom ? new Date(selEntity.ValidFrom) : undefined;
				opts.ValidTo = selEntity.ValidTo ? new Date(selEntity.ValidTo) : undefined;
				opts.PaymentTermPaFk = selEntity.PaymentTermPaFk;
				opts.ClerkPrcFk = selEntity.ClerkPrcFk;
				opts.PaymentTermFiFk = selEntity.PaymentTermFiFk;
				opts.PaymentTermAdFk = selEntity.PaymentTermAdFk;
			}
		}
	}

	private async getConBoqItemFk(selEntity:IConHeaderEntity){
		const boqItemId = this.http.get<IBoqItemEntity>('procurement/contract/wizard/getboqitembyid',{ params : { ConHeaderFk : selEntity!.Id } }).then(e=>{
			return e.Id;
		});
		return boqItemId ?? null;
	}

	private async getDefaultWicTypeFk(){
		const wicTypes = await firstValueFrom(this.wicTypeLookupService.getList());
		const foundWicType = wicTypes?.find(type => {
			return type.IsDefault;
		});
		return foundWicType ? foundWicType.Id : undefined;
	}
}
