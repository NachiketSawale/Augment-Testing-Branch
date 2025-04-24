/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstLineItem2CostGroupEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * CostGroupCatFk
 */
  CostGroupCatFk?: number | null;

/*
 * CostGroupFk
 */
  CostGroupFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * MainItemId64
 */
  MainItemId64?: number | null;

/*
 * NodeItemId
 */
  NodeItemId?: number | null;

/*
 * RootItemId
 */
  RootItemId?: number | null;
}
