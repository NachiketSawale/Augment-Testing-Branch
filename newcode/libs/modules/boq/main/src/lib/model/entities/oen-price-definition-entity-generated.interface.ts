/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenPriceDefinitionEntityGenerated extends IEntityBase {

/*
 * Category
 */
  Category?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsFixedPrice
 */
  IsFixedPrice: boolean;

/*
 * IsIndex
 */
  IsIndex: boolean;

/*
 * IsShoppingCart
 */
  IsShoppingCart: boolean;

/*
 * OenServicePartFk
 */
  OenServicePartFk?: number | null;

/*
 * Share
 */
  Share: number;
}
