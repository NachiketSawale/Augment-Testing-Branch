import { Injectable, InjectionToken } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

export const PROCUREMENT_REQUISITION_PRICE_CONDITION_PARAM_DATA_TOKEN = new InjectionToken<RequisitionPriceConditionParamDataService>('procurementRequisitionPriceConditionParamDataService');

@Injectable({
	providedIn: 'root',
})
export class RequisitionPriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected dataService: ProcurementRequisitionHeaderDataService) {
		super(dataService, PriceConditionHeaderEnum.Requisition);
	}
}
