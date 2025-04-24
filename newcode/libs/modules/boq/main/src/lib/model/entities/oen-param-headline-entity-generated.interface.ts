/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenParamHeadlineEntityGenerated extends IEntityBase {

/*
 * BlobsCommentFk
 */
  BlobsCommentFk?: number | null;

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * OenParamSetFk
 */
  OenParamSetFk: number;

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
 * Sorting
 */
  Sorting: number;
}
