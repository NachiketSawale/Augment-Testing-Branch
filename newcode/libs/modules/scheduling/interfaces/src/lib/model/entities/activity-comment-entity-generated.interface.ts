/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityCommentEntityGenerated extends IEntityBase {

/*
 * ActivityEntity
 */
  ActivityEntity?: IActivityEntity | null;

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * CommentFk
 */
  CommentFk?: number | null;

/*
 * Id
 */
  Id?: number | null;
}
