import { isNil } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
	FieldType,
	IGridDialogOptions,
	StandardDialogButtonId,
	UiCommonGridDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';

import { IPPSItemEntity } from '../../model/models';
import { IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';


export interface IDialogComponentEntity extends IEngDrawingComponentEntityGenerated{
	Checked: boolean;
	BillingQuantity: number;
	BillQtyFactor: number;
}


@Injectable({
	providedIn: 'root'
})
export class PpsItemPickComponentDialogService {

	private https = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public async showDialog(parentSelectedItem: IPPSItemEntity) {
		await this.checkData(parentSelectedItem);
	}

	public async checkData(parentSelectedItem: IPPSItemEntity) {
		if (parentSelectedItem != undefined) {
			const productTemplateId = parentSelectedItem.ProductDescriptionFk;
			const getUrl = this.configurationService.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcdrawingcomponent/listbyprodesId?ProductDescriptionFk=' + productTemplateId;
			await this.https.get(getUrl).subscribe(res => {
				let mdcComponents: IDialogComponentEntity[] = [];
				if (Object(res).data != undefined && Object(res).data.length > 0) {
					mdcComponents = Object(res).data as IDialogComponentEntity[];
					const request = this.getDrwCompBillQtyInfoRequest(parentSelectedItem, mdcComponents);
					const postUrl = this.configurationService.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/getdrwcomponentsbillingqtyinforesult';
					this.https.post(postUrl, request).subscribe(res => {
						this.processCompsForBillQty(res, mdcComponents);
						this.showPickupComponentsDialog(parentSelectedItem, mdcComponents);
					});
				} else {
					this.showPickupComponentsDialog(parentSelectedItem, mdcComponents);
				}
			});
		} else {
			const strContent = this.translateService.instant('productionplanning.item.wizard.moreItemsWarn').text;
			const strTitle = this.translateService.instant('productionplanning.item.upstreamItemSplit.dialogTitle').text;
			this.msgBoxService.showMsgBox(strContent, strTitle, 'warning');
		}
	}

	public async showPickupComponentsDialog(parentSelectedItem: IPPSItemEntity, mdcComponents: IEngDrawingComponentEntityGenerated[]) {
		const title = this.translateService.instant('productionplanning.drawing.pickComponents.dialogTitle').text;
		const dialogConfig: IGridDialogOptions<IDialogComponentEntity> = {
			width: '80%',
			headerText: title,
			windowClass: 'grid-dialog',
			gridConfig: {
				uuid: '9ae6315174be49f6bb6df2a438b8c791',
				columns: [
					{
						id: 'check',
						model: 'Check',
						type: FieldType.Boolean,
						label: {
							text: '*Check',
							key: 'cloud.common.entityChecked'
						},
						visible: true,
						sortable: false
					},
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: '*Code',
							key: 'cloud.common.entityCode'
						},
						readonly: true,
						visible: true,
						sortable: false
					},
					{
						id: 'desc',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {
							text: '*Description',
							key: 'cloud.common.entityDescription'
						},
						readonly: true,
						visible: true,
						sortable: false
					},
				]
			},
			isReadOnly: false,
			allowMultiSelect: true,
			items: [],
			selectedItems: [],
		};


		const result = await this.gridDialogService.show(dialogConfig);
		if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
			const drwCompCreationInfoArray = (await result).value?.items?.filter(e => e.Checked)
				.map(mdcComp => {
					return {
						MdcDrawingComponentId: mdcComp.Id,
						Quantity: mdcComp.Quantity,
						Quantity2: mdcComp.Quantity2,
						Quantity3: mdcComp.Quantity3,
						BillingQuantity: mdcComp.BillingQuantity
					};
				});
			if(drwCompCreationInfoArray !== undefined && drwCompCreationInfoArray.length > 0){
				const postData = {
					proDesId: parentSelectedItem.ProductDescriptionFk,
					creationInfoes: drwCompCreationInfoArray
				};
				const postUrl = this.configurationService.webApiBaseUrl + 'productionplanning/drawing/component/createbymdccomponent';
				await this.https.post(postUrl, postData).subscribe(response=> {
					//var engComponents = response.data;
					// var drawingService = drawingComponentDataService.getService({'serviceKey': 'productionplanning.item.component'});
					// var flatItems = drawingService.getUnfilteredList();
					// _.forEach(engComponents, function (entity){
					// 	flatItems.push(entity);
					// });
					// drawingService.markEntitiesAsModified(engComponents);
					// drawingService.gridRefresh();
				});
			}
		}
	}

	public getDrwCompBillQtyInfoRequest(selectedPpsItem: IPPSItemEntity, mdcComponents: IEngDrawingComponentEntityGenerated[]) {
		const materialIds = Array.from(new Set(mdcComponents.map(e => e.MdcMaterialFk).filter(e => !isNil(e))));
		const costCodeIds = Array.from(new Set(mdcComponents.map(e => e.MdcCostCodeFk).filter(e => !isNil(e))));
		return {
			PPSHeaderId: selectedPpsItem.PPSHeaderFk,
			PUId: selectedPpsItem.Id,
			MaterialIds: materialIds,
			CostCodeIds: costCodeIds
		};
	}

	public processCompsForBillQty(response: object, mdcComponents: IDialogComponentEntity[]) {
		if (Object(response).data) {
			const materialIdToBillingQtyFactor = Object(response).data.MaterialIdToBillingQtyFactor;
			const costCodeIdToBillingQtyFactor = Object(response).data.CostCodeIdToBillingQtyFactor;
			mdcComponents.forEach(comp => {
				if (comp.MdcMaterialFk) {
					comp.BillQtyFactor = materialIdToBillingQtyFactor[comp.MdcMaterialFk] ?? 1;
				} else if (comp.MdcCostCodeFk) {
					comp.BillQtyFactor = costCodeIdToBillingQtyFactor[comp.MdcCostCodeFk] ?? 1;
				}
			});
		}
	}
}
