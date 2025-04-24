/*
 * Copyright(c) RIB Software GmbH
 */

import { IExceptionDayEntity } from './exception-day-entity.interface';
import { IShift2GroupEntity } from './shift-2group-entity.interface';
import { IShiftWorkingTimeEntity } from './shift-working-time-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IShiftEntityGenerated extends IEntityBase {

  /**
   * CalendarFk
   */
  CalendarFk: number;

  /**
   * DefaultWorkdayFk
   */
  DefaultWorkdayFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * ShiftGroupFk
   */
  ShiftGroupFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * TimesheetContextFk
   */
  TimesheetContextFk: number;

  /**
   * TksExceptionDayEntities
   */
  TksExceptionDayEntities?: IExceptionDayEntity[] | null;

  /**
   * TksShift2groupEntities
   */
  TksShift2groupEntities?: IShift2GroupEntity[] | null;

  /**
   * TksShiftWorkingTimeEntities
   */
  TksShiftWorkingTimeEntities?: IShiftWorkingTimeEntity[] | null;
}
