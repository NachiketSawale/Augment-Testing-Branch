import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import {
	PlatformTranslateService,
} from '@libs/platform/common';
import { EstimateMainDetailCalculationService } from './estimate-main-detail-calculation.service';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainDetailValidationService{

	private readonly estimateMainDetailCalculationService = inject(EstimateMainDetailCalculationService);
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * @name mapCultureValidation
	 * @methodOf EstimateMainCommonCalculationService
	 * @description Mark Resource, Root Parent and Children at all level as modified
	 * @param {object} info
	 * @param {boolean} filterComment IEstResourceEntity selected resource item
	 * @param {boolean} isMapCulture IEstResourceEntity[] List of all Resources
	 */
	public mapCultureValidation<T>(info: ValidationInfo<T>, filterComment: boolean = true, isMapCulture: boolean = false): ValidationResult{
		let checkVal = info.value;
		if (typeof checkVal === 'number') {
			checkVal = checkVal.toString();
		}

		if(typeof checkVal === 'string' && filterComment){
			checkVal = checkVal.replace(/'.*?'/gi, '').replace(/{.*?}/gi, '');
		}

		const isMapCultureInternal = isMapCulture || this.estimateMainDetailCalculationService.getIsMapCulture(checkVal);
		if (!isMapCultureInternal) {
			return {
				apply: true,
				valid: false,
				error: this.translateService.instant('cloud.common.computationFormula').text
			};
		}
		return {apply: true, valid: true};
	}
}