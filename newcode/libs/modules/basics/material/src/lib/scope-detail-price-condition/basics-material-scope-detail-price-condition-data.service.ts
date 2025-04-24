/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {BasicsSharedPriceConditionDataService, IPriceConditionContext} from '@libs/basics/shared';
import {
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    ServiceRole
} from '@libs/platform/data-access';

import {BasicsMaterialScopeDetailDataService} from '../scope-detail/basics-material-scope-detail-data.service';
import { IMaterialPriceConditionEntity, IMaterialScopeDetailEntity } from '@libs/basics/interfaces';
import { MaterialScopeDetailComplete } from '../model/complete-class/material-scope-detail-complete.class';

/**
 * The material scope detail PriceCondition service
 */
@Injectable({
    providedIn: 'root'
})
export  class BasicsMaterialScopeDetailPriceConditionDataService extends BasicsSharedPriceConditionDataService<IMaterialPriceConditionEntity, IMaterialScopeDetailEntity, MaterialScopeDetailComplete> {

	protected constructor(private parentService: BasicsMaterialScopeDetailDataService) {
		const options: IDataServiceOptions<IMaterialPriceConditionEntity> = {
			apiUrl: 'basics/material/scope/detail/pricecondition',
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
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceConditionEntity, IMaterialScopeDetailEntity, MaterialScopeDetailComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialScopeDetailPc',
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
			HeaderName: 'basicsMaterialScopeDetailDataService'
		};
	}

	public onCalculateDone(total: number, totalOc: number) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem) {
			parentItem.PriceExtra = total;
			parentItem.PriceExtraOc = totalOc;
		}
	}
}