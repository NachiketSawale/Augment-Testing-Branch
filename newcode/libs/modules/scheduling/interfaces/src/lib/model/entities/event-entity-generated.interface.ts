/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEventEntityGenerated extends IEntityBase {

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * Date
 */
  Date?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DistanceTo
 */
  DistanceTo?: number | null;

/*
 * EndDate
 */
  EndDate?: string | null;

/*
 * EventFk
 */
  EventFk?: number | null;

/*
 * EventTypeFk
 */
  EventTypeFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDisplayed
 */
  IsDisplayed?: boolean | null;

/*
 * IsFixedDate
 */
  IsFixedDate?: boolean | null;

/*
 * PlacedBefore
 */
  PlacedBefore?: boolean | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;
}
