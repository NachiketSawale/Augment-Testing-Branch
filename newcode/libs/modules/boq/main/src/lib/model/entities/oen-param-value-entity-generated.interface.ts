/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenParamValueEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OenParamValueListFk
 */
  OenParamValueListFk: number;

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

/*
 * ValueNumber
 */
  ValueNumber?: number | null;

/*
 * ValueText
 */
  ValueText?: string | null;
}
