/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEmployeeDefaultEntityGenerated extends IEntityBase {

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
   * From
   */
  From?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MasterdataContextFk
   */
  MasterdataContextFk: number;
}
