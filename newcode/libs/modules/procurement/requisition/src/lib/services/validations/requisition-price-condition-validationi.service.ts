import { inject, Injectable } from '@angular/core';
import { ProcurementCommonPriceConditionValidationService } from '@libs/procurement/common';
import { IReqItemEntity } from '../../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../../model/req-item-complete.class';
import { RequisitionPriceConditionDataService } from '../requisition-price-condition-data.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionPriceConditionValidationiService extends ProcurementCommonPriceConditionValidationService<IReqItemEntity, ReqItemComplete> {
	public constructor() {
		const dataService = inject(RequisitionPriceConditionDataService);
		super(dataService);
	}
}
