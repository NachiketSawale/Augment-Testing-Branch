/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBoqHeader2ClerkEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * Id
 */
  Id: number;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * ClerkRoleFk
 */
  ClerkRoleFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * Comment
 */
  CommentText?: string | null;

}
