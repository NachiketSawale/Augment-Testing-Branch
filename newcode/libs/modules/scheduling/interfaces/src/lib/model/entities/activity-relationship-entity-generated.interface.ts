/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityRelationshipEntityGenerated extends IEntityBase {

/*
 * ActivityEntity_ChildActivityFk
 */
  ActivityEntity_ChildActivityFk?: IActivityEntity | null;

/*
 * ActivityEntity_ParentActivityFk
 */
  ActivityEntity_ParentActivityFk?: IActivityEntity | null;

/*
 * ChildActivityFk
 */
  ChildActivityFk: number;

/*
 * ChildScheduleFk
 */
  ChildScheduleFk?: number | null;

/*
 * FixLagPercent
 */
  FixLagPercent?: number | null;

/*
 * FixLagTime
 */
  FixLagTime?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCritical
 */
  IsCritical?: boolean | null;

/*
 * ParentActivityFk
 */
  ParentActivityFk: number;

/*
 * PredecessorActivityFk
 */
  PredecessorActivityFk?: number | null;

/*
 * PredecessorCode
 */
  PredecessorCode?: string | null;

/*
 * PredecessorDesc
 */
  PredecessorDesc?: string | null;

/*
 * PredecessorProjectName
 */
  PredecessorProjectName?: string | null;

/*
 * PredecessorProjectNo
 */
  PredecessorProjectNo?: string | null;

/*
 * PredecessorSchedule
 */
  PredecessorSchedule?: string | null;

/*
 * RelationKindFk
 */
  RelationKindFk?: number | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;

/*
 * SuccessorCode
 */
  SuccessorCode?: string | null;

/*
 * SuccessorDesc
 */
  SuccessorDesc?: string | null;

/*
 * SuccessorProjectName
 */
  SuccessorProjectName?: string | null;

/*
 * SuccessorProjectNo
 */
  SuccessorProjectNo?: string | null;

/*
 * SuccessorSchedule
 */
  SuccessorSchedule?: string | null;

/*
 * UseCalendar
 */
  UseCalendar?: boolean | null;

/*
 * VarLagPercent
 */
  VarLagPercent?: number | null;

/*
 * VarLagTime
 */
  VarLagTime?: number | null;
}
