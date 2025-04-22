/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
	IPrcItemPriceConditionEntity,
	ProcurementCommonPriceConditionDataService
} from '@libs/procurement/common';
import { ConItemComplete } from '../model/con-item-complete.class';
import { IConItemEntity } from '../model/entities';
import { ProcurementContractItemDataService } from './procurement-contract-item-data.service';
import {IPriceConditionContext} from '@libs/basics/shared';


export const PROCUREMENT_CONTRACT_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<ProcurementContractPriceConditionDataService>('procurementContractPriceConditionDataService');


/**
 * The PrcItem PriceCondition service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPriceConditionDataService extends ProcurementCommonPriceConditionDataService<IConItemEntity, ConItemComplete> {
	protected internalModuleName = 'procurement.contract';

	/**
	 * The constructor
	 */
	public constructor(protected contractItemService: ProcurementContractItemDataService) {
		super(contractItemService);
	}

	public getContextFromParent(): IPriceConditionContext {
		let headerId = -1;
		let projectId = -1;
		let prcPriceConditionId: number | null = -1;
		let exchangeRate = 1;
		if (this.contractItemService.getSelection().length > 0) {
			const parentItem = this.contractItemService.getSelectedEntity()!;
			const contractHeader = this.contractItemService.parentService.getSelection()[0];
			headerId = contractHeader.Id;
			prcPriceConditionId = parentItem.PrcPriceConditionFk ?? null;
			exchangeRate = contractHeader.ExchangeRate;
			if (contractHeader.ProjectFk) {
				projectId = contractHeader.ProjectFk;
			}
		}
		return {
			PrcPriceConditionId: prcPriceConditionId,
			HeaderId: headerId,
			HeaderName: this.internalModuleName,
			ProjectFk: projectId,
			ExchangeRate: exchangeRate
		};
	}

	public override isParentFn(parentKey: IConItemEntity, entity: IPrcItemPriceConditionEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}