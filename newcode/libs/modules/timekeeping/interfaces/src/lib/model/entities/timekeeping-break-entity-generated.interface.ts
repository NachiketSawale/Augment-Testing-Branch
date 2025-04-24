/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface ITimekeepingBreakEntityGenerated extends IEntityBase {

/*
 * BreakEnd
 */
  BreakEnd?: string | null;

/*
 * BreakStart
 */
  BreakStart?: string | null;

/*
 * Duration
 */
  Duration?: number | null;

/*
 * FromTimeBreakDate
 */
  FromTimeBreakDate?: string | null;

/*
 * FromTimeBreakTime
 */
  FromTimeBreakTime?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ReportFk
 */
  ReportFk?: number | null;

/*
 * ToTimeBreakDate
 */
  ToTimeBreakDate?: string | null;

/*
 * ToTimeBreakTime
 */
  ToTimeBreakTime?: string | null;
}
