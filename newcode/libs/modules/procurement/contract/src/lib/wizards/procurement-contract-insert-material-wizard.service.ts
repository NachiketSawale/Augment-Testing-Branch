/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService, StandardDialogButtonId, IFormDialogConfig, FieldType, createLookup, UiCommonFormDialogService, IDialogErrorInfo, ILookupContext } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { BasicsSharedMaterialCatalogLookupService, BasicsSharedMaterialDiscountGroupLookupService, BasicsSharedMaterialGroupLookupService } from '@libs/basics/shared';
import { isNull, isUndefined } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { IMaterialDiscountGroupLookupEntity, IMaterialGroupLookupEntity } from '@libs/basics/interfaces';

interface IInsertMaterialOptions {
	PrcHeaderFK: number;
	MaterialCatalogFk?: number;
	MaterialGroupFk?: number;
	MaterialDiscountGroupFk?: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractInsertMaterialWizardService {
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly dataService = inject(ProcurementContractHeaderDataService);
	private isMaterialGroupReadonly: boolean = true;

	public async onStartWizard() {
		const selectedItem = this.dataService.getSelectedEntity()!;
		if (!selectedItem) {
			const errorInfo: IDialogErrorInfo = {
				errorCode: 0,
				errorVersion: '',
				errorMessage: this.translateService.instant('procurement.contract.noSelectRecord').text,
				detailMethod: null,
				detailMessage: '',
				detailStackTrace: '',
				errorDetail: '',
			};
			await this.messageBoxService.showErrorDialog(errorInfo);
			return;
		}
		const options: IFormDialogConfig<IInsertMaterialOptions> = {
			entity: {
				PrcHeaderFK: selectedItem?.PrcHeaderFk,
				MaterialCatalogFk: undefined,
				MaterialGroupFk: undefined,
				MaterialDiscountGroupFk: undefined
			},
			id: 'insertMaterial',
			headerText: this.translateService.instant('procurement.common.wizard.insertMaterial.insertMaterialTitle').text,
			formConfiguration: {
				formId: 'insertMaterialWizard',
				showGrouping: false,
				rows: [{
					id: 'materialCatalogFk',
					model: 'MaterialCatalogFk',
					type: FieldType.Lookup,
					required: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialCatalogLookupService,
					}),
					label: {
						'key': 'basics.material.reference.entityMdcMaterialCatalogFk'
					},
					change: e => {
						this.isMaterialGroupReadonly = isNull(e.newValue) || isUndefined(e.newValue);
					}
				}, {
					id: 'materialGroupFk',
					model: 'MaterialGroupFk',
					type: FieldType.Lookup,
					required: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialGroupLookupService,
						serverSideFilter: {
							key: 'insert-material-group-filter',
							execute(context:ILookupContext<IMaterialGroupLookupEntity, IInsertMaterialOptions>) {
								return 'MaterialCatalogFk=' + context.entity!.MaterialCatalogFk;
							}
						},
						//todo-need framework needs to support functions, and currently only supports true and false
						/*
						disabled:()=>{
							return this.isMaterialGroupReadonly;
						}*/
					}),
					label: {
						'key': 'basics.material.record.materialGroup'
					}
				}, {
					id: 'materialDiscountGroupFk',
					model: 'MaterialDiscountGroupFk',
					type: FieldType.Lookup,
					required: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialDiscountGroupLookupService,
						serverSideFilter: {
							key: 'procurement-contract-material-discount-group-filter',
							execute(context: ILookupContext<IMaterialDiscountGroupLookupEntity, IInsertMaterialOptions>) {
								return 'MaterialCatalogFk=' + context.entity!.MaterialCatalogFk;
							}
						},
					}),
					label: {
						'key': 'procurement.common.wizard.insertMaterial.discountGroup'
					}
				}],
			},
			showOkButton: true,
			showCancelButton: true,
			//todo- if framework buttons api is ready,uncomment below code ,and change showOkButton: false
			/*
			buttons:[
				{
					id: 'testOk', //TODO workaround here. If set as the standard OK button. the isDisable button will not call
					caption:{key: 'ui.common.dialog.okBtn'},
					isDisabled: () => {
						const {MaterialCatalogFk, MaterialGroupFk, MaterialDiscountGroupFk} = options.entity;
						return (MaterialCatalogFk || MaterialGroupFk || MaterialDiscountGroupFk);
					},
				}
			] */
		};
		const callResult = await this.formDialogService.showDialog<IInsertMaterialOptions>(options);
		//todo-if framework buttons api is ready,need change StandardDialogButtonId.Ok to testOk
		if (callResult?.closingButtonId === StandardDialogButtonId.Ok) {
			const prcHeaderFk = this.dataService.getHeaderEntity().Id;
			await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}procurement/contract/wizard/updateMaterial`, {
				PrcHeaderFK: prcHeaderFk,
				materialcatalogfk: options.entity.MaterialCatalogFk,
				materialgroupfk: options.entity.MaterialGroupFk,
				materialdiscountgroupfk: options.entity.MaterialDiscountGroupFk
			}));
			this.messageBoxService.showInfoBox(this.translateService.instant('procurement.common.wizard.insertMaterial.insertMaterialSucceed').text, 'info', true);
		}
	}
}