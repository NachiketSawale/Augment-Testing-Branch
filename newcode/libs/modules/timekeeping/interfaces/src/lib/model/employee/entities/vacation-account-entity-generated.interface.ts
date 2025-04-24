/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IVacationAccountEntityGenerated extends IEntityBase {

  /**
   * BookingDate
   */
  BookingDate: string;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * Duration
   */
  Duration?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsYearlyExpireScheduleEntry
   */
  IsYearlyExpireScheduleEntry: boolean;

  /**
   * IsYearlyStartScheduleEntry
   */
  IsYearlyStartScheduleEntry: boolean;

  /**
   * TimesymbolFk
   */
  TimesymbolFk: number;
}
