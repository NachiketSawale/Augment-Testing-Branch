/*
 * Copyright(c) RIB Software GmbH
 */

import { IShiftEntity } from './shift-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IExceptionDayEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Duration
   */
  Duration?: number | null;

  /**
   * ExceptDate
   */
  ExceptDate: Date | string;

  /**
   * Id
   */
  Id: number;

  /**
   * IsWorkday
   */
  IsWorkday: boolean;

  /**
   * ShiftEntity
   */
  ShiftEntity?: IShiftEntity | null;

  /**
   * ShiftFk
   */
  ShiftFk: number;

  /**
   * TimeSymWorkOnHolidayFk
   */
  TimeSymWorkOnHolidayFk?: number | null;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk?: number | null;
}
