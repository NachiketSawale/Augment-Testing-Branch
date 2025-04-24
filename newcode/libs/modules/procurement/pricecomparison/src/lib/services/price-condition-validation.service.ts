/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IPrcItemEntity,
	PrcCommonItemComplete,
	ProcurementCommonPriceConditionValidationService
} from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementPriceComparisonPriceConditionDataService } from './price-condition-data.service';


/**
 * Contract Price Condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonPriceConditionValidationService extends ProcurementCommonPriceConditionValidationService<IPrcItemEntity, PrcCommonItemComplete> {
	public constructor() {
		const dataService = inject(ProcurementPriceComparisonPriceConditionDataService);
		super(dataService);
	}
}