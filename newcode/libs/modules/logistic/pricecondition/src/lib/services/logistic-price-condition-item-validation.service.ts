/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IPriceConditionItemEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionItemDataService } from './logistic-price-condition-item-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

/**
 * Logistic Price Condition item Validation Service
 * */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionItemValidationService extends BaseValidationService<IPriceConditionItemEntity> {

	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(LogisticPriceConditionItemDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IPriceConditionItemEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
		};
	}

	private validateValidFrom(info: ValidationInfo<IPriceConditionItemEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo, 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IPriceConditionItemEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom, <string>info.value, 'ValidFrom');
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPriceConditionItemEntity> {
		return this.dataService;
	}
}