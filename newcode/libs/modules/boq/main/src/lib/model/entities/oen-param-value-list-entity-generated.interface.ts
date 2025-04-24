/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenParamValueEntity } from './oen-param-value-entity.interface';
import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenParamValueListEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * IsCustomValueAllowed
 */
  IsCustomValueAllowed: boolean;

/*
 * OenParamFk
 */
  OenParamFk: number;

/*
 * OenParamValues
 */
  OenParamValues?: IOenParamValueEntity[] | null;

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
