/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IActivitySplitEntityGenerated extends IEntityBase {

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsBreak
 */
  IsBreak?: boolean | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedEnd
 */
  PlannedEnd?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;
}
