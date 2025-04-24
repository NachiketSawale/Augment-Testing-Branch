/*
 * Copyright(c) RIB Software GmbH
 */

import { IShiftBreakEntity } from './shift-break-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IShiftWorkingTimeEntityGenerated extends IEntityBase {

  /**
   * Acronym
   */
  Acronym?: string | null;

  /**
   * BreakFrom
   */
  BreakFrom?: string | null;

  /**
   * BreakTo
   */
  BreakTo?: string | null;

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
   * ExceptionDayFk
   */
  ExceptionDayFk?: number | null;

  /**
   * FromTime
   */
  FromTime?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsBreaksAvailable
   */
  IsBreaksAvailable?: boolean | null;

  /**
   * IsOnlyOneBreak
   */
  IsOnlyOneBreak?: boolean | null;

  /**
   * ShiftBreakEntities
   */
  ShiftBreakEntities?: IShiftBreakEntity[] | null;

  /**
   * ShiftFk
   */
  ShiftFk: number;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk?: number | null;

  /**
   * ToTime
   */
  ToTime?: string | null;

  /**
   * WeekdayFk
   */
  WeekdayFk: number;
}
