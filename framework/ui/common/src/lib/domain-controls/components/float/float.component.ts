/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';

import { INumericControlContext } from '../../model/numeric-control-context.interface';
import { FloatConfigInjectionToken } from '../../model/float-config.interface';

import { UiNumericConverterService } from '../../services/numeric-converter.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';



/**
 * An input box for floating point numbers.
 */
@Component({
	selector: 'ui-common-float',
	templateUrl: './float.component.html',
	styleUrls: ['./float.component.scss'],
})
export class FloatComponent extends DomainControlBaseComponent<number, INumericControlContext> implements OnDestroy {

	/**
	 * Used to emit events when input value changes.
	 */
	private debounceSubject = new Subject<void>();

	/**
	 * Used to emit value when component is destroyed.
	 */
	private destroy$ = new Subject<void>();

	/**
	 * Used to store input value.
	 */
	public inputValue: string | undefined;


	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		this.getInputValue();

	}

	/**
	 * The editor options the component is initialized with.
	 */
	public readonly editorConfig = inject(FloatConfigInjectionToken);

	/**
	 * Element reference of current component.
	 */
	public readonly elementRef = inject(ElementRef);

	/**
	 * Provides access to functions from numeric converter service.
	 */
	private readonly numericConverterService = inject(UiNumericConverterService);

	/**
	 * Used to execute conversion function after specified debounce time.
	 */
	public getInputValue() {
		this.debounceSubject.pipe(
			debounceTime(2000),
			takeUntil(this.destroy$)
		).subscribe(() => {
			this.convertToNumber(this.inputValue);
		});
	}

	/**
	 * Retrieves the current value converted to a string.
	 */
	public get value(): string | undefined {
		return this.formatToDecimal(this.controlContext.value?.toString());
	}


	/**
	 * Sets the current value as a string.
	 * @param {string | undefined} rawValue The raw value as a string.
	 */
	public set value(rawValue: string | undefined) {
		this.inputValue = rawValue;
		this.debounceSubject.next();
	}


	/**
	 * Convert input value into number format.
	 * @param {string|undefined} rawValue
	 */
	public convertToNumber(rawValue: string | undefined) {
		if (typeof rawValue === 'string') {
			if (typeof rawValue !== 'undefined') {
				rawValue = this.removedDecimal(rawValue);
				let newVal = parseFloat(rawValue.replace(/,/g, ''));
				newVal = Number(this.covertLargeDigitNumber(newVal.toString()));
				if (Number.isFinite(newVal)) {
					this.controlContext.value = newVal;
				} else {
					this.controlContext.value = 0;
				}
			}
		} else {
			this.controlContext.value = rawValue;
		}
	}


	/**
	 * This function is used to convert input value into decimal format.
	 * @param {string} inputValue
	 * @returns {string} formattedValue
	 */
	public formatToDecimal(inputValue: string | undefined): string {
		const inputMode = this.elementRef.nativeElement.getElementsByTagName('input')[0].getAttribute('inputmode');

		if (typeof inputValue !== 'undefined') {
			let formattedValue: string = this.numericConverterService.formatValue(inputValue, inputMode, this.editorConfig.decimalPlaces).toString();
			formattedValue = this.covertLargeDigitNumber(formattedValue);
			return formattedValue;
		} else {
			return '';
		}

	}

	/**
	 * Used to convert large digit number like numbers with exponential part.
	 * @param {string} value
	 * @returns string
	 */
	public covertLargeDigitNumber(value: string): string {
		if (value.includes('e+')) {
			value = this.formatToDecimal(value);
		}
		return value;
	}


	/**
	 * This event is used to get input value from input field
	 * and allow only integers with provided decimal places.
	 * @param {Event} event
	 */
	@HostListener('input', ['$event'])
	public handleInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const inputValue = inputElement.value;
		const decimalValue = this.removedDecimal(inputValue);
		inputElement.value = decimalValue;
	}


	/**
	 * This function is used to allow only integers including
	 * negative numbers in input field and also check for decimal places.
	 * @param {string} inputValue
	 * @returns {string} inputValue
	 */
	public removedDecimal(inputValue: string | undefined): string {
		if (typeof inputValue !== 'undefined') {
			inputValue = inputValue.replace(/[^0-9.,-]/g, '');
			const decimalIndex = inputValue.indexOf('.');
			if (decimalIndex !== -1 && inputValue.substring(decimalIndex + 1).length > this.editorConfig.decimalPlaces) {
				inputValue = inputValue.slice(0, decimalIndex + this.editorConfig.decimalPlaces + 1);
			}

			if (inputValue.startsWith('-')) {
				inputValue = '-' + inputValue.replace(/-/g, '');
			} else {
				inputValue = inputValue.replace(/-/g, '');
			}
			return inputValue;
		} else {
			return '';
		}
	}


	/**
	 * Unsubscribed subject on component destroyed.
	 */
	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
