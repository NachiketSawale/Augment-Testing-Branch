/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeEntity } from './employee-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeLeaveEntityGenerated extends IEntityBase {

  /**
   * CurrentBalance
   */
  CurrentBalance?: number | null;

  /**
   * CurrentYear
   */
  CurrentYear?: number | null;

  /**
   * EmployeeEntity
   */
  EmployeeEntity?: IEmployeeEntity | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PermanentBalance
   */
  PermanentBalance?: number | null;

  /**
   * RemainingBalance
   */
  RemainingBalance?: number | null;

  /**
   * RemainingExpired
   */
  RemainingExpired: boolean;
}
