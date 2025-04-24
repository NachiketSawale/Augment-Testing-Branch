/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IActivityObservationEntityGenerated extends IEntityBase {

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * ActivityObservedFk
 */
  ActivityObservedFk?: number | null;

/*
 * ActualDuration
 */
  ActualDuration?: number | null;

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CurrentDuration
 */
  CurrentDuration?: number | null;

/*
 * CurrentFinish
 */
  CurrentFinish?: string | null;

/*
 * CurrentStart
 */
  CurrentStart?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * ProjectName
 */
  ProjectName?: string | null;

/*
 * ProjectNo
 */
  ProjectNo?: string | null;

/*
 * ScheduleCode
 */
  ScheduleCode?: string | null;

/*
 * ScheduleDescription
 */
  ScheduleDescription?: IDescriptionInfo | null;
}
