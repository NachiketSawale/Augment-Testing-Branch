/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IEstRoundingConfigDetailEntity } from '@libs/estimate/interfaces';
import { ValidationInfo } from '@libs/platform/data-access';

/**
 * Service for rounding config detail validation.
 */
@Injectable({
	providedIn: 'root',
})
export class RoundingConfigDetailValidationService {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	/**
	 * Validate column id
	 * @param info
	 */
	public validateColumnId(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.validationUtils.isMandatory(info);
	}

	/**
	 * Validate is without rounding
	 * @param info
	 */
	public validateIsWithoutRounding(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		//TODo-walt
		//entity[field] = value;
		//processService.processItem(entity);
		return this.validationUtils.isMandatory(info);
	}

	/**
	 * validate round to
	 * @param info
	 */
	public validateRoundTo(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.validateNumberRange(info);
	}

	/**
	 * validate ui display to
	 * @param info
	 */
	public validateUiDisplayTo(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.validateNumberRange(info);
	}

	/**
	 * validate RoundToFk
	 * @param info
	 */
	public validateRoundToFk(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.validationUtils.isMandatory(info);
	}

	/**
	 * validate RoundingMethodFk
	 * @param info
	 */
	public validateRoundingMethodFk(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.validationUtils.isMandatory(info);
	}

	private isValidQuantityRange(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.isAmong(info, 0, 6);
	}

	private isValidPriceRange(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		return this.isAmong(info, 0, 7);
	}

	private validateNumberRange(info: ValidationInfo<IEstRoundingConfigDetailEntity>) {
		let result = this.validationUtils.isMandatory(info);
		if (result.valid && info.entity && info.entity.ColumnId) {
			const quantityColumnIds = [1, 2, 3, 4, 5];
			const costColumnIds = [6, 7, 8, 9];

			if (quantityColumnIds.includes(info.entity.ColumnId)) {
				result = this.isValidQuantityRange(info);
			}
			if (costColumnIds.includes(info.entity.ColumnId)) {
				result = this.isValidPriceRange(info);
			}
		}
		return result;
	}

	private isAmong(info: ValidationInfo<IEstRoundingConfigDetailEntity>, start: number, end: number) {
		if (info.value && ((info.value as number) < start || (info.value as number) > end)) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.amongValueErrorMessage',
				params: {
					object: info.field.toLowerCase(),
					rang: start + '-' + end,
				},
			});
		}
		return this.validationUtils.createSuccessObject();
	}
}
