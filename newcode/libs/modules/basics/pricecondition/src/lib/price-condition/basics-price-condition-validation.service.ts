/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsPriceConditionDataService } from './basics-price-condition-data.service';
import { IPriceConditionEntity } from '../model/entities/price-condition-entity.interface';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * basics price condition validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionValidationService extends BaseValidationService<IPriceConditionEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsPriceConditionDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IPriceConditionEntity> {
		return {
			DescriptionInfo: this.validateDescriptionInfo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPriceConditionEntity> {
		return this.dataService;
	}

	//TODO:[DEV-29240] not support change value now and wait framework
	protected async validateDescriptionInfo(info: ValidationInfo<IPriceConditionEntity>): Promise<ValidationResult> {
		return this.validationUtils.checkSynAndAsyncUnique(info, this.dataService.getList(), 'basics/pricecondition/isunique', {
			additionalHttpParams: {description: info.entity.DescriptionInfo?.Description},
			fieldName: 'cloud.common.entityDescription'
		});
	}
}
