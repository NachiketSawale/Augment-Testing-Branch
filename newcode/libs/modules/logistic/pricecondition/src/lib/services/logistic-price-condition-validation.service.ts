/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { get, isObject } from 'lodash';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Logistic Price Condition Validation Service
 */

@Injectable({
	providedIn: 'root',
})
export class LogisticPriceConditionValidationService extends BaseValidationService<IPriceConditionEntity> {
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private dataService = inject(LogisticPriceConditionDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPriceConditionEntity> {
		return {
			IsDefault: this.validateIsDefault,
			Code: this.asyncValidateCode,
		};
	}

	private validateIsDefault(info: ValidationInfo<IPriceConditionEntity>): ValidationResult {
		if (info.value) {
			this.dataService
				.getList()
				.filter((priceList) => priceList.IsDefault === true)
				.forEach(function (item) {
					item.IsDefault = false;
				});
			this.dataService.setModified(info.entity);
		}

		return new ValidationResult();
	}

	protected asyncValidateCode(info: ValidationInfo<IPriceConditionEntity>): Promise<ValidationResult> {
		return this.validationService.isAsyncUnique(info, 'logistic/pricecondition/isunique', 'cloud.common.code').then((response) => {
			const entityValue = get(info.entity, info.field);
			if (!entityValue && isObject(response)) {
				response.apply = true;
			}
			return response;
		});
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPriceConditionEntity> {
		return this.dataService;
	}
}
