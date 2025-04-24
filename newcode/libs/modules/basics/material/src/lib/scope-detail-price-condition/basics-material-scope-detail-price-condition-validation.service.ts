/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { BasicsMaterialScopeDetailPriceConditionDataService } from './basics-material-scope-detail-price-condition-data.service';

import { IMaterialPriceConditionEntity, IMaterialScopeDetailEntity } from '@libs/basics/interfaces';
import { MaterialScopeDetailComplete } from '../model/complete-class/material-scope-detail-complete.class';
/**
 * Basics material price list price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialScopeDetailPriceConditionValidationService
	extends BasicsSharedPriceConditionValidationService<IMaterialPriceConditionEntity,IMaterialScopeDetailEntity,MaterialScopeDetailComplete> {

	protected constructor(dataService: BasicsMaterialScopeDetailPriceConditionDataService) {
		super(dataService);
	}
}