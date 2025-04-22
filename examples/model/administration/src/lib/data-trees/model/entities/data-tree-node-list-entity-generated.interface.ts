/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDataTreeLevelEntity } from './data-tree-level-entity.interface';
import { IDataTreeNodeEntity } from './data-tree-node-entity.interface';

export interface IDataTreeNodeListEntityGenerated {

/*
 * Levels
 */
  Levels: IDataTreeLevelEntity[];

/*
 * Nodes
 */
  Nodes: IDataTreeNodeEntity[];
}
