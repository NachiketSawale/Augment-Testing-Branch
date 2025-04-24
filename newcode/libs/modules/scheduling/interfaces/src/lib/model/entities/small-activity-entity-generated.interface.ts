/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISmallActivityEntity } from './small-activity-entity.interface';

export interface ISmallActivityEntityGenerated {

/*
 * Activities
 */
  Activities?: ISmallActivityEntity[] | null;

/*
 * ActivityTypeFk
 */
  ActivityTypeFk?: number | null;

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * CalendarFk
 */
  CalendarFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * LocationFk
 */
  LocationFk?: number | null;

/*
 * ParentActivityFk
 */
  ParentActivityFk?: number | null;

/*
 * PercentageCompletion
 */
  PercentageCompletion?: number | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | Date | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | Date | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityUoMFk
 */
  QuantityUoMFk?: number | null;

/*
 * SCurveFk
 */
  SCurveFk?: number | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;

/*
 * Specification
 */
  Specification?: string | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;

/*
 * UserDefinedText06
 */
  UserDefinedText06?: string | null;

/*
 * UserDefinedText07
 */
  UserDefinedText07?: string | null;

/*
 * UserDefinedText08
 */
  UserDefinedText08?: string | null;

/*
 * UserDefinedText09
 */
  UserDefinedText09?: string | null;

/*
 * UserDefinedText10
 */
  UserDefinedText10?: string | null;
}
