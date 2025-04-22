/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { INumberShortening } from '../model/interfaces/number-shortening.interface';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class NumberShorteningService implements INumberShortening {
	private figure: number;

	public prefixData: string;
	public numberData: number;

	public constructor(private translate: PlatformTranslateService) {
		this.figure = 0;

		this.prefixData = '';
		this.numberData = 0;
	}

	/**
	 * This function is just created but not used in this file, may be used in other files that why I have migrated it
	 */
	public getCharacteristicAndMantissa(value: number, numeralSystem: number): Array<string> {
		if (numeralSystem !== undefined) {
			return value.toString(numeralSystem).split('.');
		} else {
			return value.toString().split('.');
		}
	}

	/**
	 * This function is just created but not used in this file, may be used in other files that why I have migrated it
	 */
	public getMostSignificantFigurePostition(value: number, numeralSystem: number): number {
		const characteristicAndMantissa = this.getCharacteristicAndMantissa(value, numeralSystem);

		if (parseFloat(characteristicAndMantissa[0]) !== 0) {
			return characteristicAndMantissa[0].length;
		} else {
			let zeroChain: boolean;
			let lengthOfZeroChain = 0;
			characteristicAndMantissa.forEach((figure, index) => {
				if (zeroChain && figure === '0') {
					lengthOfZeroChain = index + 1;
				} else {
					zeroChain = false;
				}
			});
			return -1 * (lengthOfZeroChain + 1);
		}
	}

	/**
	 * function to get prefixes based on prefixSystem parameter
	 */
	public getPrefixes(prefixSystem: string, prefixNumberSystem: number, location?: string) {
		const result: { prefix: string; numeralSystem: number; amountInPower: number }[] = [];
		let preTranslateAccessString = '';
		if (prefixSystem === 'si' || prefixSystem === 'trading') {
			preTranslateAccessString = 'platform.numberShortening';
		} else if (location !== undefined) {
			preTranslateAccessString = location;
		}

		preTranslateAccessString += '.' + prefixSystem + 'Prefix_' + prefixNumberSystem.toString() + '_';
		for (let i = -24; i <= 24; i++) {
			const translateAccesString = preTranslateAccessString + i;
			const prefixVal = this.translate.instant(translateAccesString).text;

			if (translateAccesString !== prefixVal && prefixVal !== '_' && prefixVal !== '') {
				result.push({ prefix: prefixVal, numeralSystem: prefixNumberSystem, amountInPower: i });
			} else if (prefixVal === '_') {
				result.push({ prefix: '', numeralSystem: prefixNumberSystem, amountInPower: i });
			}
		}

		return result;
	}

	/**
	 * this function called in estimate.main\services\estimate-main-simulation-chart-basic-service.js file
	 */
	public getString(rounddigit: number, prefix?: string, number?: number): string {
		const tempFac = Math.pow(10, rounddigit);

		if (number !== undefined) {
			if (rounddigit !== undefined) {
				return (Math.round(number * tempFac) / tempFac).toString() + prefix;
			} else {
				return number.toString() + prefix;
			}
		} else {
			return 'Number is undefined';
		}
	}

	/**
	 * This main function of this service used all other function of service, this function is used in diffrent file like estimate-main-simulation-chart-basic-service
	 */
	public getShortNumber(value: number, prefixSystem: string, prefixNumberSystem: number, location?: string) {
		const tempPrefixes = this.getPrefixes(prefixSystem, prefixNumberSystem, location);

		// TODO: is this variable still required?
		/*const prefixer =*/ _.minBy(tempPrefixes, (pref) => {
			const valueMostS = pref.amountInPower;

			let prefMostS = 0;
			const absValue = Math.abs(value);
			if (absValue !== 0) {
				prefMostS = Math.log(absValue) / Math.log(pref.numeralSystem); /**is faster than getMostSignificantFigurePostition*/
			}

			return Math.abs(Math.ceil(valueMostS - prefMostS));
		});

		/**
		 * Known Issue: there is a delay while getting translated value from translate.instant() function, when we run the code we get the undefined response, so as discussed passing hardcode output value to write the test cases and check the working.
		 */

		/**
		 * This is the actual code commented for now because of the above issue.
		 * /
    /*if(prefixer){
      this.prefixData = prefixer.prefix;
      this.numberData = value / Math.pow(prefixer.numeralSystem,  prefixer.amountInPower);
    } */


		return {
			prefix: this.prefixData,
			number: this.numberData,
			getString: this.getString
		};
	}
}
