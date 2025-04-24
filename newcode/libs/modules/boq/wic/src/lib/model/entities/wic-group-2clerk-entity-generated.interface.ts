/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IWicGroup2ClerkEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * ClerkRoleFk
 */
  ClerkRoleFk?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * ValidTo
 */
  ValidTo?: string | null;

/*
 * WicCatGroupFk
 */
  WicCatGroupFk?: number | null;
}
