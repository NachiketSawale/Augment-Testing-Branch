/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import * as accounting from 'accounting';

import { PlatformLanguageService } from '@libs/platform/common';

import { INumericConversionOptions } from '../model/numeric-conversion-options.interface';

/**
 * Used for formatting numeric input values based on inputmode.
 */
@Injectable({
  providedIn: 'root'
})

export class UiNumericConverterService {

  /**
   * Provides access to functions from language service for getting language 
   * data.
   */
  public readonly languageService = inject(PlatformLanguageService);


  /**
   * Format input value based on provided inputmode and precision.
   * @param {string} viewValue input value
   * @param {string} inputMode provided input mode (eg. decimal,numeric..)
   * @param {number} precision decimal places value (eg. 0,2,3..)
   * @returns {string|number} formatted value
   */
  public formatValue(viewValue: string, inputMode: string, precision: number): string | number {

    const options = this.getOptions(inputMode, precision);

    if (viewValue) {
      viewValue = viewValue.replace(/\s/g, '');

      if (viewValue.search(/[,.]/g) !== -1 && options.precision) {

        const split: string[] = viewValue.replace(/,/g, options.decimal).replace(/\./g, options.decimal).split(options.decimal);
        const last: string | undefined = split.pop();

        if (typeof last !== 'undefined') {
          viewValue = split.length ? split.join('').concat(options.decimal, last) : last;
        }
      } else {
        viewValue = viewValue.replace(/[,.]/g, '');
      }

      let result: number | string = accounting.unformat(viewValue, options.decimal);

      if (inputMode !== 'inputselect') {
        result = this.formatters(result, options);
      }

      return result;
    }
    return viewValue;
  }


  /**
   * Provides options based on current language data.
   * @param {string} inputMode provided input mode (eg. decimal,numeric..)
   * @param {number} precision decimal places value (eg. 0,2,3..)
   * @returns {INumericConversionOptions} options for formatting.
   */
  public getOptions(inputMode: string, precision: number): INumericConversionOptions {

    const lang = this.languageService.getLanguageInfo();
    const options: INumericConversionOptions = {
      thousand: inputMode !== 'numeric' ? lang.numeric.thousand : '',
      decimal: lang.numeric.decimal,
      precision: precision || 0
    };

    return options;
  }


  /**
   * Formats given number
   * @param {number | null} modelValue input value 
   * @param {INumericConversionOptions} options options for formatting.
   * @returns {string} formatted value
   */
  public formatters(modelValue: number | null, options: INumericConversionOptions): string {

    return modelValue !== null && typeof modelValue !== 'undefined' ? accounting.formatNumber(modelValue, options.precision, options.thousand, options.decimal) : '';
  }
}
