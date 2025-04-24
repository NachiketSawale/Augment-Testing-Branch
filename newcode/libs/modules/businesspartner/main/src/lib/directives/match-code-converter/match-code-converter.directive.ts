/*
 * Copyright(c) RIB Software GmbH
 */

import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Directive({
	selector: '[businessPartnerMainMatchCodeConverter]',
})
export class MatchCodeConverterDirective implements ControlValueAccessor {
	public onChange!: (value: string) => void;

	public constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	/**
	 * This method is called to write to the view when programmatic changes from model to view
	 * are requested.This function is automatically called when model value changes.
	 *
	 * @param {string|null} modelValue The new value for the element
	 */
	public writeValue(modelValue: string | null): void {
		const element: ElementRef = this.el.nativeElement;
		if (modelValue) {
			this.renderer.setProperty(element, 'value', this.convert(modelValue));
		} else {
			this.renderer.setProperty(element, 'value', modelValue);
		}
	}

	/**
	 * Registers a callback function that is called when the control's value changes in the UI,
	 * this function is called automatically when view value changes
	 *
	 * @param {Function} fn 	The callback function to register
	 */
	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	/**
	 * Registers a callback function that is called by the forms API on initialization to update
	 * the form model on blur.
	 *
	 * @param {Function} fn 	The callback function to register
	 */
	public registerOnTouched(fn: () => void): void {
		// todo: implement it.
	}

	@HostListener('input', ['$event.target.value'])

	/**
	 * This method is called to write to the model when there is change in the view value,
	 * this function is automatically called when view value changes.
	 *
	 * @param {string|null} viewValue 	The new value for the model
	 */
	public input(viewValue: string | null): void {
		if (viewValue) {
			const valueConverted = this.convert(viewValue);
			if (Number.isNaN(valueConverted)) {
				viewValue = valueConverted;
				this.writeValue(viewValue);
			}
		}
	}

	public convert(value: string) {
		return value
			.replace(/[Ääà]/g, 'A')
			.replace(/ç/g, 'C')
			.replace(/[éèê]/g, 'E')
			.replace(/î/g, 'I')
			.replace(/[Öö]/g, 'O')
			.replace(/ß/g, 'S')
			.replace(/[Üüùû]/g, 'U')
			.replace(/[^A-Za-z0-9\- ]*/g, '');
	}
}
