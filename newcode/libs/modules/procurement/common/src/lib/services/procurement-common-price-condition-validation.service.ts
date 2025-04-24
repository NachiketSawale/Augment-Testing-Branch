/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementCommonPriceConditionDataService } from './procurement-common-price-condition-data.service';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { IPrcItemEntity, IPrcItemPriceConditionEntity } from '../model/entities';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';

/**
 * Procurement common price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonPriceConditionValidationService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete>
	extends BasicsSharedPriceConditionValidationService<IPrcItemPriceConditionEntity,PT,PU> {

	protected constructor(dataService: ProcurementCommonPriceConditionDataService<PT, PU>) {
		super(dataService);
	}
}