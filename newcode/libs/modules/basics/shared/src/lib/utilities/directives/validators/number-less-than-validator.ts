/*
 * Copyright(c) RIB Software GmbH
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validator that checks if the value is less than the specified limit.
 * If the limit is null or undefined, the validation is skipped.
 * @param limit - The limit value that the control's value must be less than.
 * @returns A Validator function.
 */
export function numberLessThanValidator(limit: number | null | undefined): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		// If limit is null or undefined, skip validation
		if (limit == null) {
			return null;
		}

		if (value == null) {
			return null;  // No value to validate
		}

		if (value === limit) {
			return {
				equal: {limit, value}
			};
		}

		if (value > limit) {
			return {
				lessThan: {limit, value}
			};
		}

		return null;
	};
}
