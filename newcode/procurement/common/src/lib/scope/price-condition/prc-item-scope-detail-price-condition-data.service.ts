/*
 * Copyright(c) RIB Software GmbH
 */
import {BasicsSharedPriceConditionDataService, IPriceConditionContext} from '@libs/basics/shared';
import {IDataServiceChildRoleOptions,IDataServiceOptions,IDataServiceEndPointOptions,ServiceRole} from '@libs/platform/data-access';
import {Injectable} from '@angular/core';
import { PrcItemScopeDetailDataService } from '../detail/prc-item-scope-detail-data.service';
import {IPrcItemScopeDetailEntity, IPrcItemEntity, IPrcItemScopeDetailPcEntity} from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { PrcItemScopeDetailComplete } from '../../model/prc-item-scope-detail-complete.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * The scope detail PriceCondition service
 */
@Injectable({
	providedIn: 'root'
})
export  class PrcItemScopeDetailPriceConditionDataService<PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>> extends BasicsSharedPriceConditionDataService<IPrcItemScopeDetailPcEntity, IPrcItemScopeDetailEntity, PrcItemScopeDetailComplete> {

	public constructor(private parentService: PrcItemScopeDetailDataService<PT,PU,HT,HU>) {
		const options: IDataServiceOptions<IPrcItemScopeDetailPcEntity> = {
			apiUrl: 'procurement/common/item/scope/detail/pricecondition',
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
			roleInfo: <IDataServiceChildRoleOptions<IPrcItemScopeDetailPcEntity, IPrcItemScopeDetailEntity, PrcItemScopeDetailComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcItemScopeDetailPc',
				parent: parentService
			}
		};

		super(parentService, options);
	}

	public getContextFromParent(): IPriceConditionContext {
		const parentSelection = this.parentService.getSelection();
		const parentItem = parentSelection.length > 0 ? parentSelection[0] : null;
		const priceConditionId = parentItem && parentItem.PrcPriceConditionFk ? parentItem.PrcPriceConditionFk : null;
		const headerId = parentItem?.Id;
		return {
			PrcPriceConditionId: priceConditionId,
			HeaderId: headerId,
			HeaderName: 'prcItemScopeDetailPriceConditionDataService'
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