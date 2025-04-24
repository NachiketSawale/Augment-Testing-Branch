/*
 * Copyright(c) RIB Software GmbH
 */

import { IShiftWorkingTimeEntity } from './shift-working-time-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IShiftBreakEntityGenerated extends IEntityBase {

  /**
   * BreakEnd
   */
  BreakEnd?: string | null;

  /**
   * BreakStart
   */
  BreakStart?: string | null;

  /**
   * Duration
   */
  Duration: number;

  /**
   * FromTimeBreakDate
   */
  FromTimeBreakDate?: Date | string | null;

  /**
   * FromTimeBreakTime
   */
  FromTimeBreakTime?: string | null;

  /**
   * ISEndAfterMidnight
   */
  ISEndAfterMidnight: boolean;

  /**
   * ISStartAfterMidnight
   */
  ISStartAfterMidnight: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * ShiftWorkingTimeEntity
   */
  ShiftWorkingTimeEntity?: IShiftWorkingTimeEntity | null;

  /**
   * ShiftWorkingtimeFk
   */
  ShiftWorkingtimeFk: number;

  /**
   * ToTimeBreakDate
   */
  ToTimeBreakDate?: Date | string | null;

  /**
   * ToTimeBreakTime
   */
  ToTimeBreakTime?: string | null;
}
