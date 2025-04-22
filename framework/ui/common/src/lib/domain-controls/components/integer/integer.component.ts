/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, HostListener, inject } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { INumericControlContext } from '../../model/numeric-control-context.interface';

import { UiNumericConverterService } from '../../services/numeric-converter.service';

/**
 * An input box for integer numbers.
 */
@Component({
	selector: 'ui-common-integer',
	templateUrl: './integer.component.html',
	styleUrls: ['./integer.component.scss'],
})
export class IntegerComponent extends DomainControlBaseComponent<number, INumericControlContext> implements AfterViewInit {
	/**
	 * precision for integer
	 */
	public precision = 0;

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	/**
	 * Provides default value to control-context on component initialized.
	 */
	public ngAfterViewInit(): void {
		this.controlContext.value ??= 0;
	}

	/**
	 * numeric converter service for formatting
	 */
	private readonly numericConverterService = inject(UiNumericConverterService);

	/**
	 * Element reference to access native element
	 */
	public readonly elementRef = inject(ElementRef);

	/**
	 * Retrieves the current value converted to a string.
	 */
	public get value(): string | undefined {
		return this.controlContext.value?.toString();
	}

	/**
	 * Sets the current value as a string.
	 * @param {string | undefined} rawValue The raw value as a string.
	 */
	public set value(rawValue: string | undefined) {
		const formattedValue = this.format(rawValue);
		typeof formattedValue === 'number' ? (rawValue = formattedValue.toString()) : (rawValue = formattedValue);

		if (typeof rawValue === 'string') {
			const newVal = parseInt(rawValue);
			if (Number.isInteger(newVal)) {
				this.controlContext.value = newVal;
			}
		} else {
			this.controlContext.value = rawValue;
		}
	}

	/**
	 * Formats the value
	 * @param {string | number | undefined} rawValue raw value added from input
	 * @returns {string |number | undefined} formatted value
	 */
	public format(rawValue: string | number | undefined): string | number | undefined {
		let formattedValue = rawValue;
		const inputMode = this.elementRef.nativeElement.getElementsByTagName('input')[0].getAttribute('inputmode');
		const options = this.numericConverterService.getOptions(inputMode, this.precision);

		if (typeof rawValue !== 'undefined' && rawValue !== null) {
			if (rawValue.toString().includes('e+')) {
				formattedValue = this.numericConverterService.formatters(parseInt(rawValue as string), options);
			}
			formattedValue = this.numericConverterService.formatValue(formattedValue!.toString(), inputMode, this.precision);
		}

		return formattedValue;
	}

	/**
	 * Restricts adding decimal in input value
	 * @param {Event} event input event
	 */
	@HostListener('input', ['$event'])
	public removeDecimal(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		let inputValue = inputElement.value;
		if (inputValue !== undefined && inputValue !== '') {
			inputValue = inputValue.replace(/\./g, '');
			inputElement.value = inputValue;
		}
	}
}
