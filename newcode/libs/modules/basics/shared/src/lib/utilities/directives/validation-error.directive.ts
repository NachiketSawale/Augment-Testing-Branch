/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Directive, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NgModel, ValidationErrors } from '@angular/forms';

/**
 * Directive to emit validation error changes from an NgModel control.
 *
 * This directive listens to the status changes of the associated NgModel control
 * and emits the current validation errors (if any) through the `validationChanges` EventEmitter.
 */
@Directive({
	selector: '[basicsSharedValidationError]',
})
export class BasicsSharedValidationErrorDirective implements OnInit, OnDestroy {
	private statusChanges?: Subscription;

	/**
	 * EventEmitter to emit the validation errors of the NgModel control.
	 */
	@Output()
	public validationChanges = new EventEmitter<ValidationErrors | null | undefined>();

	/**
	 * Constructor to inject the NgModel control.
	 *
	 * @param ngModel - The NgModel control to monitor for validation errors.
	 */
	public constructor(private ngModel: NgModel) {}

	/**
	 * Initializes the directive by subscribing to the status changes of the NgModel control.
	 * Emits the current validation errors whenever the status changes.
	 */
	public ngOnInit() {
		this.statusChanges = this.ngModel.control.statusChanges?.subscribe(() => {
			this.validationChanges.emit(this.ngModel.control.errors);
		});
	}

	/**
	 * Cleans up the directive by unsubscribing from the status changes of the NgModel control.
	 */
	public ngOnDestroy() {
		this.statusChanges?.unsubscribe();
	}
}