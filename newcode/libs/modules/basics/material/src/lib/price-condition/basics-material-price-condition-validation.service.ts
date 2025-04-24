/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { IMaterialPriceConditionEntity, IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsMaterialPriceConditionDataService } from './basics-material-price-condition-data.service';
import { MaterialComplete } from '../model/complete-class/material-complete.class';

/**
 * Basics material price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialPriceConditionValidationService
	extends BasicsSharedPriceConditionValidationService<IMaterialPriceConditionEntity,IMaterialEntity,MaterialComplete> {

	protected constructor(dataService: BasicsMaterialPriceConditionDataService) {
		super(dataService);
	}
}