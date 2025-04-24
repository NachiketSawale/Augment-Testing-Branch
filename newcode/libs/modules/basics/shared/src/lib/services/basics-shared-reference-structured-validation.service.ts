/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { BasicsSharedDataValidationService } from './basics-shared-data-validation.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { ValidationResult } from '@libs/platform/data-access';

/**
 * Injectable service for validating structured reference numbers.[HPAQC-100848]
 * - if the content starts with "++" or "**" then according to the rule OGM (see below)
 * - if the content starts with "RF" then according to the rule structured creditor reference (see below)
 * - if it starts with any other characters => content is rejected
 *
 * OGM
 * Format: ++XXX/XXXX/XXXXX++ (instead of '+' signs, the '*' sign can also be used)
 * The first 10 'X' are digits, the last two are the result of a calculation.
 * For example:
 * ++001/2512/67859++
 * (1)The first 10 digits 0012515678 are divided by 97 = 129027.6082
 * (2)The digits behind the separator are then multiplied by 97: 0.6082 x 97 = 58.9954
 * (3)This number is rounded up to become 59, which are the two last digits of the OGM.
 * (4)If there are no digits behind the separator then '97' has to be put as the last two digits of the OGM.
 * see: en.wikipedia.org/wiki/Creditor_Reference
 *
 * RF
 * (1)Move the first four characters of the RF creditor reference number to the right end of the reference.
 * Example 1: RF45G72UUR    ---->    G72UURRF45
 * Example 2: RF214377    ---->    4377RF21
 * (2)Convert RF to numeric according to the table below:
 * Example 1: G72UURRF45    ---->    16 7 2 30 30 27 27 15 4 5
 * Example 2: 4377RF21    ---->    4 3 7 7 27 15 2 1
 * (3)Translation of charaters into digits: 'A' -> '10', 'B' -> '11', ..., 'Z' -> '35'
 * (4)Calculate the modulo 97 (the remainder after division by 97)
 * Example 1: 1672303027271545 % 97 = 1
 * Example 2: 4377271521 % 97 = 51
 * (5)If the remainder is 1 (one), then the check digits are correct.
 * Example 1: RF45G72UUR    ---->    OK
 * Example 2: RF214377    ---->    NOT OK
 * see: www.mobilefish.com/services/creditor_reference/creditor_reference.php
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedReferenceStructuredValidationService {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translate = inject(PlatformTranslateService);

	/**
	 * 97: Calculate the modulo 97 (the remainder after division by 97)
	 */
	private readonly calculateModulo: number = 97;

	/**
	 * Validates a structured reference value.
	 * @remark HPAQC-100848 the rule structured creditor reference about 'OGM' && 'RF'
	 * @Example Ok - RF45G72UUR, RF6518K5
	 * @Example Failed - RF35C4, RF214377
	 * @param value The reference value to be validated.
	 * @returns A ValidationResult object indicating the validity and any error message.
	 */
	public validationReferenceStructured(value?: string) {
		const validateResult = this.validationUtils.createSuccessObject();
		if (isEmpty(value) || isNull(value) || isUndefined(value)) {
			validateResult.valid = true;
		} else {
			this.processValue(value, validateResult);
		}

		if (!validateResult.valid) {
			validateResult.error = this.translate.instant('procurement.invoice.error.referenceError').text;
		}

		return validateResult;
	}

	private processValue(value: string, validateResult: ValidationResult) {
		if (value.startsWith('+') || value.startsWith('*')) {
			this.validateOgmValue(value, validateResult);
		} else if (value.toUpperCase().startsWith('RF')) {
			this.validateRfValue(value, validateResult);
		} else {
			validateResult.valid = false;
		}
	}

	/**
	 * Validates reference numbers starting with '+' or '*'.
	 * @param value - The Ogm value to be validated.
	 * @param validateResult - The initial ValidationResult object.
	 * @returns ValidationResult: Check the concatenated number against a specific condition (Calculate 97 equals substr(10, 2))
	 */
	private validateOgmValue(value: string, validateResult: ValidationResult) {
		//Search globally for the plus sign +, asterisk *, or slash/in the string value and replace it with the empty string '', i.e. remove all these special characters.
		const ogmValue = value.replace(/[+*//]/g, '');
		//Creates a regular expression that matches any string that begins with a numeric character
		if (ogmValue.match(/^\d/)) {
			const tenNumber = parseInt(ogmValue.substring(0, Math.min(ogmValue.length, 10)), 10); // 10 first digits
			//The purpose of this line is to check the length of the string ogmValue. If the length is long enough, it extracts the substring of the 11th and 12th characters in the string; If the length is insufficient, it will set compareNumber to the string '0'
			const compareNumber = ogmValue.length >= 12 ? ogmValue.slice(10, 12) : '0';
			const dividedNumber = (tenNumber / this.calculateModulo).toString();
			if (dividedNumber.includes('.')) {
				const multipliedNumber = parseFloat('0' + dividedNumber.split('.')[1]) * this.calculateModulo;
				validateResult.valid = Math.round(multipliedNumber).toString() === compareNumber;
			} else {
				validateResult.valid = true;
			}
		} else {
			validateResult.valid = false;
		}
	}

	/**
	 * Validates the given RF value by rearranging and converting it to a numeric value.
	 *
	 * @param {string} value - The RF value to be validated.
	 * @param {ValidationResult} validateResult - The result object to store validation status and errors.
	 * @returns ValidationResult: Check the concatenated number against a specific condition (Calculate 97 equals 1)
	 */
	private validateRfValue(value: string, validateResult: ValidationResult) {
		//Rearranges the given value by moving the first four characters to the end.
		const rfValue = value.slice(4) + value.slice(0, 4);
		// Converts the rearranged RF value to a numeric value.
		const translatedDigits = rfValue.split('').map(c => this.translateLetterToNumber(c));
		const numberValue = parseInt(translatedDigits.join(''), 10);
		// Checks if the numeric value modulo 97 equals 1, indicating a valid RF value.
		validateResult.valid = numberValue % this.calculateModulo === 1;
	}

	/**
	 * Translates a single letter to its corresponding number.
	 * @param item The letter to be translated.
	 * @returns The corresponding number as a string, or an empty string if not found.
	 */
	private translateLetterToNumber(item: string): string {
		return this.charToNumber(item.toUpperCase())?.toString() || (/\d/.test(item) ? item : '');
	}
	/**
	 * Ensure the input is a single uppercase letter from A to Z
	 * @Example 'A' -> '10', 'B' -> '11', 'C' -> '12', ..., 'Y' -> '34', 'Z' -> '35'
	 * @param char a single uppercase letter from A to Z
	 * @returns Return null if input is invalid, Return number when ok
	 */
	private charToNumber(char: string): number | null {
		if (char.length === 1 && char >= 'A' && char <= 'Z') {
			return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
		}
		return null;
	}
}
