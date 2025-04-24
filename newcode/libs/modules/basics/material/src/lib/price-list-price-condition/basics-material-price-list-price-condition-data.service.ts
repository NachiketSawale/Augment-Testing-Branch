/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsSharedPriceConditionDataService, IPriceConditionContext} from '@libs/basics/shared';
import {
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {Injectable} from '@angular/core';
import {BasicsMaterialPriceListDataService} from '../material-price-list/basics-material-price-list-data.service';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { MaterialPriceListComplete } from '../model/complete-class/material-price-list-complete.class';

/**
 * The material price list  PriceCondition service
 */
@Injectable({
    providedIn: 'root'
})
export  class BasicsMaterialPriceListPriceConditionDataService extends BasicsSharedPriceConditionDataService<IMaterialPriceConditionEntity, IMaterialPriceListEntity, MaterialPriceListComplete> {

	protected constructor(protected parentService: BasicsMaterialPriceListDataService) {
		const options: IDataServiceOptions<IMaterialPriceConditionEntity> = {
			apiUrl: 'basics/material/pricelistpricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list'
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
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceConditionEntity, IMaterialPriceListEntity, MaterialPriceListComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialPriceListCondition',
				parent: parentService
			}
		};
		super(parentService, options);
	}

	public getContextFromParent(): IPriceConditionContext {
		const parentSelection = this.parentService.getSelection();
		const parentItem = parentSelection.length > 0 ? parentSelection[0] : null;
		const priceConditionId = parentItem && parentItem.PrcPriceConditionFk ? parentItem.PrcPriceConditionFk : null;
		return {
			PrcPriceConditionId: priceConditionId,
			HeaderName: 'basicsMaterialPriceListService'
		};
	}

	public onCalculateDone(total: number, totalOc: number) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtras = total;
			this.parentService.calculateCost(parentItem);
		}
	}

	public override isParentFn(parentKey: IMaterialPriceListEntity, entity: IMaterialPriceConditionEntity): boolean {
		return entity.PrcPriceConditionTypeFk === parentKey.Id;
	}
}
