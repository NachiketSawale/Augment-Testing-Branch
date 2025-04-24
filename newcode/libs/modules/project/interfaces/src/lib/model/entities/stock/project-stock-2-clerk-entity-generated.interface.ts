/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectStock2ClerkEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * BasClerkFk
 */
  BasClerkFk: number;

/*
 * BasClerkRoleFk
 */
  BasClerkRoleFk: number;

/*
 * Comment
 */
  Comment: string;

/*
 * PrjStockFk
 */
  PrjStockFk: number;

/*
 * ValidFrom
 */
  ValidFrom: string | null;

/*
 * ValidTo
 */
  ValidTo: string | null;
}
