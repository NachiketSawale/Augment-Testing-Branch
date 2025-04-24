/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
// import * as IBAN from 'iban';
import { IIban } from '../model/interfaces/iban-converter.interface';

/**
 * constant for implementing controlvalueaccessor operation
 */
export const EPANDED_TEXTAREA_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => IbanConverterDirective),
	multi: true,
};

/**
 * This class performs the IBAN number conversion
 */

@Directive({
	selector: '[uiCommonIbanConverter]',
})
export class IbanConverterDirective implements ControlValueAccessor, IIban {
	onChange!: Function;

	constructor(private el: ElementRef, private renderer: Renderer2) {}

	/**
	 * This method is called to write to the view when programmatic changes from model to view
	 * are requested.This function is automatically called when model value changes.
	 *
	 * @param {string|null} modelValue The new value for the element
	 */
	writeValue(modelValue: string | null): void {
		const element: ElementRef = this.el.nativeElement;
		// if (!_.isNil(modelValue)) {
		// 	this.renderer.setProperty(element, 'value', IBAN.printFormat(modelValue));
		// } else {
		// 	this.renderer.setProperty(element, 'value', modelValue);
		// }
	}

	/**
	 * Registers a callback function that is called when the control's value changes in the UI,
	 * this function is called automatically when view value changes
	 *
	 * @param {Function} fn 	The callback function to register
	 */
	registerOnChange(fn: Function): void {
		this.onChange = fn;
	}

	/**
	 * Registers a callback function that is called by the forms API on initialization to update
	 * the form model on blur.
	 *
	 * @param {Function} fn 	The callback function to register
	 */
	registerOnTouched(fn: Function): void {}

	@HostListener('input', ['$event.target.value'])

	/**
	 * This method is called to write to the model when there is change in the view value,
	 * this function is automatically called when view value changes.
	 *
	 * @param {string|null} viewValue 	The new value for the model
	 */
	input(viewValue: string | null): void {
		const element: ElementRef = this.el.nativeElement;
		// if (!_.isNil(viewValue) && IBAN.isValid(viewValue)) {
		// 	let model: string = IBAN.electronicFormat(viewValue);
		// 	let trans: string = IBAN.printFormat(model);

		// 	if (trans !== viewValue) {
		// 		this.renderer.setProperty(element, 'value', trans);
		// 	}
		// 	this.writeValue(model);
		// } else {
		// 	this.writeValue(viewValue);
		// }
	}
}

