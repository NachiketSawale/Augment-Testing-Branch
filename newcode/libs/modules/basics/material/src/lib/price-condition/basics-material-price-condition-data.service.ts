/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsSharedPriceConditionDataService, IPriceConditionContext} from '@libs/basics/shared';
import {IDataServiceChildRoleOptions,IDataServiceOptions,IDataServiceEndPointOptions,ServiceRole} from '@libs/platform/data-access';
import {BasicsMaterialRecordDataService} from '../material/basics-material-record-data.service';
import { IMaterialPriceConditionEntity, IMaterialEntity } from '@libs/basics/interfaces';
import {Injectable} from '@angular/core';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * The material PriceCondition service
 */
@Injectable({
    providedIn: 'root'
})
export  class BasicsMaterialPriceConditionDataService extends BasicsSharedPriceConditionDataService<IMaterialPriceConditionEntity, IMaterialEntity, MaterialComplete> {

	public constructor(private parentService: BasicsMaterialRecordDataService) {
		const options: IDataServiceOptions<IMaterialPriceConditionEntity> = {
			apiUrl: 'basics/material/pricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1,
						existedTypes: this.getList().map(entity => entity.PrcPriceConditionTypeFk)
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceConditionEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialPriceCondition',
				parent: parentService
			}
		};

		super(parentService, options);
	}

	public getContextFromParent(): IPriceConditionContext {
		const parentSelection = this.parentService.getSelection();
		const parentItem = parentSelection.length > 0 ? parentSelection[0] : null;
		const priceConditionId = parentItem && parentItem.PrcPriceconditionFk ? parentItem.PrcPriceconditionFk : null;
		const headerId = parentItem?.Id;
		return {
			PrcPriceConditionId: priceConditionId,
			HeaderId: headerId,
			HeaderName: 'basicsMaterialRecordService'
		};
	}

	public onCalculateDone(total: number, totalOc: number, field: string) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtra = total;
			this.parentService.recalculateCost(parentItem, undefined, field, true);
		}
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialPriceConditionEntity): boolean {
		return entity.MdcMaterialFk === parentKey.Id;
	}
}