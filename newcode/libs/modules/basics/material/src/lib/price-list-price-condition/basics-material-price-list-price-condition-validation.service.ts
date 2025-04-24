/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { BasicsMaterialPriceListPriceConditionDataService } from './basics-material-price-list-price-condition-data.service';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { MaterialPriceListComplete } from '../model/complete-class/material-price-list-complete.class';

/**
 * Basics material price list price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialPriceListPriceConditionValidationService
	extends BasicsSharedPriceConditionValidationService<IMaterialPriceConditionEntity,IMaterialPriceListEntity,MaterialPriceListComplete> {

	protected constructor(dataService: BasicsMaterialPriceListPriceConditionDataService) {
		super(dataService);
	}
}