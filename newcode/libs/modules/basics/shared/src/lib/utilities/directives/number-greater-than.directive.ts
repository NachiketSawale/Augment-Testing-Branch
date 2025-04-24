/*
 * Copyright(c) RIB Software GmbH
 */

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { numberGreaterThanValidator } from './validators/number-greater-than-validator';

/**
 * Directive to validate that a number is greater than a specified value.
 *
 * This directive uses the `numberGreaterThanValidator` to validate that the value of the associated
 * NgModel control is greater than the specified number.
 */
@Directive({
	selector: '[basicsSharedNumberGreaterThan]',
})
export class BasicsSharedNumberGreaterThanDirective implements OnChanges {
	/**
	 * The number to compare against. The value of the NgModel control must be greater than this number.
	 */
	@Input() public basicsSharedNumberGreaterThan: number | null | undefined;

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
		if (changes['basicsSharedNumberGreaterThan']) {
			this.ngModel.control.setValidators(numberGreaterThanValidator(this.basicsSharedNumberGreaterThan));
			this.ngModel.control.updateValueAndValidity();
		}
	}
}
