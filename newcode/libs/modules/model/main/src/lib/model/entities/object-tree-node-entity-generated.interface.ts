/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectTreeNodeEntity } from './object-tree-node-entity.interface';

export interface IObjectTreeNodeEntityGenerated {

/*
 * children
 */
  children?: IObjectTreeNodeEntity[] | null;

/*
 * id
 */
  id?: number | null;

/*
 * isComposite
 */
  isComposite?: boolean | null;

/*
 * meshId
 */
  meshId?: number | null;
}
