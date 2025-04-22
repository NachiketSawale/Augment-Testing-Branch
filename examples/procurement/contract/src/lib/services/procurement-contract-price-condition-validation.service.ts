/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonPriceConditionValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IConItemEntity } from '../model/entities';
import { ProcurementContractPriceConditionDataService } from './procurement-contract-price-condition-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';


/**
 * Contract Price Condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPriceConditionValidationService extends ProcurementCommonPriceConditionValidationService<IConItemEntity, ConItemComplete> {
	public constructor() {
		const dataService = inject(ProcurementContractPriceConditionDataService);
		super(dataService);
	}
}