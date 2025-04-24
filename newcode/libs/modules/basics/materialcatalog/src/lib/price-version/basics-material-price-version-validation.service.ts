/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsMaterialPriceVersionDataService } from './basics-material-price-version-data.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { IMaterialPriceVersionEntity } from '../model/entities/material-price-version-entity.interface';

/**
 * Material price version validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionValidationService extends BaseValidationService<IMaterialPriceVersionEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialPriceVersionDataService);
	private translate = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialPriceVersionEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			Weighting: this.validateWeighting,
			PriceListFk: this.validatePriceListFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialPriceVersionEntity> {
		return this.dataService;
	}

	private validateValidFrom(info: ValidationInfo<IMaterialPriceVersionEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo, 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IMaterialPriceVersionEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom, <string>info.value, 'ValidFrom');
	}

	private validateWeighting(info: ValidationInfo<IMaterialPriceVersionEntity>): ValidationResult {
		const result = new ValidationResult();
		if ((info.value as number) > 0) {
			result.apply = true;
		} else {
			result.apply = false;
			result.error = this.translate.instant('basics.materialcatalog.errGreaterThanZero').text;
		}

		return result;
	}

	private validatePriceListFk(info: ValidationInfo<IMaterialPriceVersionEntity>): ValidationResult {
		return this.validationUtils.isFkMandatory(info);
	}
}
