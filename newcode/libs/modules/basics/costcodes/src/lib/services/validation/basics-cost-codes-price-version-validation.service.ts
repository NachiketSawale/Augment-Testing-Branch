/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsCostCodesPriceVersionDataService } from '../data-service/basics-cost-codes-price-version-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';

export const BASICS_COSTCODES_PRICE_VERSION_VALIDATION_TOKEN = new InjectionToken<BasicCostCodesPriceVersionValidationService>('basicsCostCodesPriceVersionValidationToken');

@Injectable({
	providedIn: 'root'
})

/**
 * BasicCostCodesPriceVersionValidationService
 */
export class BasicCostCodesPriceVersionValidationService extends BaseValidationService<ICostcodePriceVerEntity> {
	private dataService = inject(BasicsCostCodesPriceVersionDataService);
	private validationservcie = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICostcodePriceVerEntity> {
		return {
			PriceListFk: this.validateRate,
			Weighting: this.validateWeighting
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICostcodePriceVerEntity> {
		return this.dataService;
	}

	/**
	 * @brief Validates the `Rate` field for the `ICostcodePriceVerEntity`.
	 * @param info A `ValidationInfo` object containing the rate data for `ICostcodePriceVerEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	public validateRate(info: ValidationInfo<ICostcodePriceVerEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * @brief Validates the `ValidTo` field for the `ICostcodePriceVerEntity`.
	 * @param info A `ValidationInfo` object containing the `ValidFrom` data for `ICostcodePriceVerEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	public validateValidTo(info: ValidationInfo<ICostcodePriceVerEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	/**
	 * @brief Validates the `ValidFrom` field for the `ICostcodePriceVerEntity`.
	 * @param info A `ValidationInfo` object containing the `ValidFrom` data for `ICostcodePriceVerEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	public validateValidFrom(info: ValidationInfo<ICostcodePriceVerEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	/**
	 * @brief Validates the `Weighting` field for the `ICostcodePriceVerEntity`
	 * @param info A `ValidationInfo` object containing the weighting data for `ICostcodePriceVerEntity`.
	 * @return A `ValidationResult` indicating the outcome of the validation process.
	 */
	public validateWeighting(info: ValidationInfo<ICostcodePriceVerEntity>): ValidationResult {
		return this.validationservcie.isMandatory(info);
	}
}
