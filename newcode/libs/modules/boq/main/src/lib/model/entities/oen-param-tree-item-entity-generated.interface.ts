/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';

export interface IOenParamTreeItemEntityGenerated {

/*
 * ParamTreeItemChildren
 */
  ParamTreeItemChildren?: IOenParamTreeItemEntity[] | null;

/*
 * ParamTreeItemParentId
 */
  ParamTreeItemParentId?: number | null;

/*
 * ParamTreeType
 */
  ParamTreeType?: string | null;
}
