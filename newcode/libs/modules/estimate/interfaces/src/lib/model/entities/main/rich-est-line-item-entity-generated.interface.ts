/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IRichEstLineItemEntityGenerated {

/*
 * DedicatedAssembly
 */
  DedicatedAssembly?: IEstLineItemEntity | null;

/*
 * LineItem
 */
  LineItem?: IEstLineItemEntity | null;
}
