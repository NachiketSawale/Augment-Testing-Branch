/*
 * Copyright(c) RIB Software GmbH
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberGreaterThanValidator(limit: number | null | undefined): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;

		if (limit == null) {
			return null; // Skip validation if no limit is provided
		}

		if (value == null) {
			return null;  // No value to validate
		}

		if (value === limit) {
			return {
				equal: {limit, value}
			};
		}

		if (value < limit) {
			return {
				greaterThan: {limit, value}
			};
		}

		return null;
	};
}
