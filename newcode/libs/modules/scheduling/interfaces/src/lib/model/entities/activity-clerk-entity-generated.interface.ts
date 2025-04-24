/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IActivityClerkEntityGenerated extends IEntityBase {

/*
 * ActivityEntity
 */
  ActivityEntity?: IActivityEntity | null;

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * ClerkRoleFk
 */
  ClerkRoleFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;
}
