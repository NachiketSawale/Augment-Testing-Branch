/*
 * Copyright(c) RIB Software GmbH
 */

import { isNil } from 'lodash';
import { Injectable } from '@angular/core';
import { ProcurementRoundingMethod } from '../../model/enums/procurement-rounding-method.enum';
import { numberNBigNumber } from './procurement-common-calculation.service';
import { round as mathRound } from 'mathjs';
import {
	noRoundingType,
	BasicsSharedDecimalPlacesEnum,
	BasicsSharedRoundingFactoryService,
	BasicsSharedRoundingModule as roundingModule,
	BasicsSharedDecimalPlacesEnum as decimalPlacesEnum
} from '@libs/basics/shared';

/**
 * Prc common rounding service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonRoundingService {
	protected readonly basicsRoundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);

	/**
	 * Get rounding type
	 */
	public getRoundingType<T>() {
		return this.basicsRoundingService.fieldsRoundType as Record<(keyof (T & noRoundingType)), number>;
	}

	/**
	 * Do round with rounding type
	 * @param roundingField
	 * @param beforeRoundingValue
	 * @param method
	 */
	public round(roundingField: number, beforeRoundingValue: numberNBigNumber, method?: ProcurementRoundingMethod): number {
		const value: number = this.transferToNumber(beforeRoundingValue);
		if (!method) {
			return (!roundingField) ?
				mathRound(value, BasicsSharedDecimalPlacesEnum.decimalPlaces2) :
				this.basicsRoundingService.doRounding(roundingField, value);
		} else {
			let afterRoundingValue;
			switch (method) {
				case ProcurementRoundingMethod.ForBoq:
					afterRoundingValue = mathRound(value, BasicsSharedDecimalPlacesEnum.decimalPlaces2);
					break;
				case ProcurementRoundingMethod.ForPrcItem:
					afterRoundingValue = (isNil(roundingField)) ?
						mathRound(value, BasicsSharedDecimalPlacesEnum.decimalPlaces2) :
						this.basicsRoundingService.doRounding(roundingField, value);
					break;
				case ProcurementRoundingMethod.ForNull:
					afterRoundingValue = mathRound(value, BasicsSharedDecimalPlacesEnum.decimalPlaces3);
					break;
			}
			return afterRoundingValue;
		}
	}

	/**
	 * Do round to pointed decimalPlace, default is 2 decimalPlace
	 * @param value
	 * @param decimalPlace
	 */
	public roundTo(value: numberNBigNumber, decimalPlace?: BasicsSharedDecimalPlacesEnum): number {
		return mathRound(this.transferToNumber(value), decimalPlace ?? decimalPlacesEnum.decimalPlaces2);
	}

	/**
	 * Converts to number type
	 * @param value
	 */
	public transferToNumber(value: numberNBigNumber): number {
		//todo Here we introduce the third-party library BigNumber, itself is an object, and number is not an object, so we judge it like this!!
		return (typeof value === 'object') ? value.toNumber() : value;
	}
}