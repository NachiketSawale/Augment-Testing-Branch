/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObject2DEntity } from './model-object-2dentity.interface';

export interface ICreateModelObject2DInputGenerated {

/*
 * Context
 */
  Context?: IModelObject2DEntity | null;

/*
 * Item
 */
  Item?: IModelObject2DEntity | null;

/*
 * Items
 */
  Items?: IModelObject2DEntity[] | null;
}
