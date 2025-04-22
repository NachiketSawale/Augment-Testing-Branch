/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { isValid } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

@Injectable({
  providedIn: 'root'
})

/**
 * Used to convert selected date based on date or dateutc input domain type.
 */
export class UiCommonDatePickerConverterService {
  /**
   * Used to store entered date from input field.
   */
  public selectedDateFromInput!: Date;

  /**
   * Used to store if utcmode or not.
   */
  public utcMode: boolean = true;

  /**
   * Used to set selected date.
   * @param {Date} selectedDate  selected date
   */
  public setSelectedDate(selectedDate: Date): void {
    this.selectedDateFromInput = selectedDate;
  }

  /**
   * Used to get selected date from input.
   * @returns {Date}
   */
  public getSelectedDateFromInput(): Date {
    return this.selectedDateFromInput;
  }

  /**
   * Used to convert inputDate into UTC format.
   * @param {string|Date} inputDate input date value
   * @returns {Date}
   */
  public getUtcDate(inputDate: string | Date): Date {
    const zonedDate = zonedTimeToUtc(new Date(inputDate), 'UTC');
    return zonedDate;
  }


  /**
   * Used to format input date based on date or dateutc input domain control type.
   * @param {string|Date} inputDate input date value
   * @returns {Date|undefined}
   */
  public formatInputDate(inputDate: string | Date): Date | undefined {
    let value;
    if (inputDate) {
      value = this.utcMode ? this.getUtcDate(inputDate) : new Date(inputDate);
      value = isValid(value) ? value : new Date();
    }
    return value;
  }
}
