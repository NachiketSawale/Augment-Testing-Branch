/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IHammockActivityEntityGenerated extends IEntityBase {

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * ActivityMemberFk
 */
  ActivityMemberFk?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;
}
