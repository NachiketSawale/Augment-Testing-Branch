/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticCardWorkEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk: number;

/*
 * EmployeeFk
 */
  EmployeeFk: number;

/*
 * Id
 */
  Id: number;

/*
 * JobCardFk
 */
  JobCardFk: number;

/*
 * JobFk
 */
  JobFk: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * SundryServiceFk
 */
  SundryServiceFk?: number | null;

/*
 * TotalTime
 */
  TotalTime: number;

/*
 * WorkBreak
 */
  WorkBreak?: number | null;

/*
 * WorkDay
 */
  WorkDay?: Date;

  //TODO: the time domain needs to be rechecked, moment, it will not work
/*
 * WorkEnd
 */
  WorkEnd: string;

/*
 * WorkStart
 */
  WorkStart: string;

/*
 * WorkingMinutes
 */
  WorkingMinutes?: number | null;
}
