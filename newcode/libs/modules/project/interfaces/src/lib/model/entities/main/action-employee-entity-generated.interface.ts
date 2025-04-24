/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IActionEmployeeEntityGenerated extends IEntityBase {

/*
 * ActionFk
 */
  ActionFk: number;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * EmployeeFk
 */
  EmployeeFk: number;

/*
 * Id
 */
  Id: number;

/*
 * ProjectFk
 */
  ProjectFk: number;
}
