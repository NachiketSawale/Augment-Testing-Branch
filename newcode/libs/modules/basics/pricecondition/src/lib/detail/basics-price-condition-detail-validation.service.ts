/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsPriceConditionDetailDataService } from './basics-price-condition-detail-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPriceConditionDetailEntity } from '../model/entities/price-condition-detail-entity.interface';

/**
 * Basics Price Condition Detail validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionDetailValidationService extends BaseValidationService<IPriceConditionDetailEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsPriceConditionDetailDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPriceConditionDetailEntity> {
		return {
			PriceConditionTypeFk: this.validatePriceConditionTypeFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPriceConditionDetailEntity> {
		return this.dataService;
	}

	protected validatePriceConditionTypeFk(info: ValidationInfo<IPriceConditionDetailEntity>) {
		if (info.value) {
			this.dataService.setValuesReadOnly([info.entity], true);
		}
		return this.validationUtils.isMandatory(info);
	}
}
