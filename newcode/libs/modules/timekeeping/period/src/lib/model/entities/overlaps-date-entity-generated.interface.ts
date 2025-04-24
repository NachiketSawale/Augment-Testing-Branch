/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IOverlapsDateEntityGenerated {

/*
 * EndDate
 */
  EndDate?: Date|string| null;

/*
 * Id
 */
  Id: number;

/*
 * StartDate
 */
  StartDate?: Date|string| null;

/*
 * TimekeepingGroupFk
 */
  TimekeepingGroupFk?: number | null;

/*
 * endDateOverlap
 */
  endDateOverlap?: boolean | null;

/*
 * startDateOverlap
 */
  startDateOverlap?: boolean | null;
}
