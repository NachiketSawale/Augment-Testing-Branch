/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementPesPriceConditionDataService } from '../procurement-pes-price-condition-data.service';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { IPesItemEntity } from '../../model/entities';
import { IPesItemPriceConditionEntity } from '../../model/entities/pes-item-price-condition-entity.interface';
import { PesItemComplete } from '../../model/complete-class/pes-item-complete.class';

/**
 * Pes Price Condition validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesPriceConditionValidationService extends BasicsSharedPriceConditionValidationService<IPesItemPriceConditionEntity, IPesItemEntity, PesItemComplete> {
	public constructor() {
		const dataService = inject(ProcurementPesPriceConditionDataService);
		super(dataService);
	}
}
