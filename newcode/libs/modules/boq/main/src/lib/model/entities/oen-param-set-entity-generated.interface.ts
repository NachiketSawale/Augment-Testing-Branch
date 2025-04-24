/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenParamHeadlineEntity } from './oen-param-headline-entity.interface';
import { IOenParamEntity } from './oen-param-entity.interface';
import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IOenParamListEntity } from './oen-param-list-entity.interface';

export interface IOenParamSetEntityGenerated extends IEntityBase {

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
 * OenParamHeadlines
 */
  OenParamHeadlines?: IOenParamHeadlineEntity[] | null;

/*
 * OenParamList
 */
  OenParamList?: IOenParamListEntity | null;

/*
 * OenParamListFk
 */
  OenParamListFk: number;

/*
 * OenParams
 */
  OenParams?: IOenParamEntity[] | null;

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
