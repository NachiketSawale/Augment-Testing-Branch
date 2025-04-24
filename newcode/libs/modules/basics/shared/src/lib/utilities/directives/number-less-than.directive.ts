/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { numberLessThanValidator } from './validators/number-less-than-validator';

/**
 * Directive to validate that a number is less than a specified value.
 *
 * This directive uses the `numberLessThanValidator` to validate that the value of the associated
 * NgModel control is less than the specified number.
 */
@Directive({
	selector: '[basicsSharedNumberLessThan]',
})
export class BasicsSharedNumberLessThanDirective implements OnChanges {
	/**
	 * The number to compare against. The value of the NgModel control must be less than this number.
	 * The limit can be null or undefined.
	 */
	@Input() public basicsSharedNumberLessThan: number | null | undefined;

	/**
	 * Constructor to inject the NgModel control.
	 *
	 * @param ngModel - The NgModel control to validate.
	 */
	public constructor(private ngModel: NgModel) {}

	/**
	 * Called when any data-bound property of a directive changes.
	 *
	 * @param changes - The changed properties.
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['basicsSharedNumberLessThan']) {
			// Apply the custom validator
			this.ngModel.control.setValidators(numberLessThanValidator(this.basicsSharedNumberLessThan));
			this.ngModel.control.updateValueAndValidity(); // Revalidate the control
		}
	}
}
