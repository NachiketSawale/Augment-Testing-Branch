/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface ICopyOrMoveDataGenerated {

/*
 * FromItems
 */
  FromItems?: IEstLineItemEntity[] | null;

/*
 * IsLookAtCopyOptions
 */
  IsLookAtCopyOptions?: boolean | null;

/*
 * ToItem
 */
  ToItem?: number | null;
}
