import { ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { IPriceConditionContext } from '@libs/basics/shared';
import { RequisitionItemsDataService } from './requisition-items-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { Injectable, InjectionToken } from '@angular/core';

export const PROCUREMENT_REQUISITION_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<RequisitionPriceConditionDataService>('procurementRequisitionPriceConditionDataService');

@Injectable({
	providedIn: 'root',
})
export class RequisitionPriceConditionDataService extends ProcurementCommonPriceConditionDataService<IReqItemEntity, ReqItemComplete> {
	public constructor(protected reqItemService: RequisitionItemsDataService) {
		super(reqItemService);
	}

	public getContextFromParent(): IPriceConditionContext {
		let headerId = -1;
		let projectId = -1;
		let prcPriceConditionId: number | null = -1;
		let exchangeRate = 1;
		if (this.reqItemService.getSelection().length > 0) {
			const parentItem = this.reqItemService.getSelectedEntity()!;
			const contractHeader = this.reqItemService.parentService.getSelectedEntity();
			if (contractHeader) {
				headerId = contractHeader.Id;
				prcPriceConditionId = parentItem.PrcPriceConditionFk ?? null;
				exchangeRate = contractHeader.ExchangeRate;
				if (contractHeader.ProjectFk) {
					projectId = contractHeader.ProjectFk;
				}
			}
		}
		return {
			PrcPriceConditionId: prcPriceConditionId,
			HeaderId: headerId,
			HeaderName: ProcurementInternalModule.Requisition,
			ProjectFk: projectId,
			ExchangeRate: exchangeRate,
		};
	}
}
