import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedCashFlowProjection } from '../models/types/basics-shared-cash-flow-projection.type';
import { FieldValidationInfo } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCashFlowValidationService {

	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	public validateScurveFk(info: FieldValidationInfo<BasicsSharedCashFlowProjection>): ValidationResult {
		return this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, 'ScurveFk'));
	}

	public validateTotalCost(info: FieldValidationInfo<BasicsSharedCashFlowProjection>) {
		const totalCost = parseFloat(info.value?.toString() || '');

		if (totalCost > 0 || totalCost < 0) {
			return new ValidationResult();
		}

		return this.validationUtils.createErrorObject('required and cannot be zero');
	}

	public validateStartWork(info: FieldValidationInfo<BasicsSharedCashFlowProjection>) {
		const result = this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, 'StartWork'));
		if (!result.valid) {
			return result;
		}

		if (info.value && info.entity.EndWork) {
			if (new Date(info.entity.EndWork).getTime() <= new Date(info.value as Date).getTime()) {
				return this.validationUtils.createErrorObject('cloud.common.Error_EndDateTooEarlier');
			}
		}
		return new ValidationResult();
	}

	public validateEndWork(info: FieldValidationInfo<BasicsSharedCashFlowProjection>) {
		const result = this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, 'EndWork'));
		if (!result.valid) {
			return result;
		}

		if (info.value && info.entity.StartWork) {

			if (new Date(info.entity.StartWork).getTime() >= new Date(info.value as Date).getTime()) {
				return this.validationUtils.createErrorObject('cloud.common.Error_EndDateTooEarlier');
			}
			//TODO: how to validate other fields DEV-20267
			//const startResult = this.validateStartWork(new FieldValidationInfo(info.entity,info.value));
			//this.validationUtils.applyValidationResult(startResult)
		}
		return new ValidationResult();
	}
}
