/*
 * Copyright(c) RIB Software GmbH
 */

import { IDataTreeNodeEntityGenerated } from './data-tree-node-entity-generated.interface';
import { IDataTreeLevelEntity } from './data-tree-level-entity.interface';

export interface IDataTreeNodeEntity extends IDataTreeNodeEntityGenerated {

	level?: IDataTreeLevelEntity;

	value?: string | number | boolean;
}
