/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectTreeNodeEntity } from './object-tree-node-entity.interface';

export interface IModelObjectTreeEntityGenerated {

/*
 * modelId
 */
  modelId?: number | null;

/*
 * subModelId
 */
  subModelId?: number | null;

/*
 * tree
 */
  tree?: IObjectTreeNodeEntity | null;
}
