/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPlannedAbsenceEntityGenerated extends IEntityBase {

  /**
   * Absenceday
   */
  Absenceday?: number | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * FromDateTime
   */
  FromDateTime: string;

  /**
   * FromTime
   */
  FromTime?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsFromToTimeReadOnly
   */
  IsFromToTimeReadOnly: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * PlannedAbsenceStatusFk
   */
  PlannedAbsenceStatusFk: number;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk: number;

  /**
   * ToDateTime
   */
  ToDateTime: string;

  /**
   * ToTime
   */
  ToTime?: string | null;
}
