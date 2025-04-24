/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenBoqItem2ParamEntity } from './oen-boq-item-2param-entity.interface';
import { IOenParamValueListEntity } from './oen-param-value-list-entity.interface';
import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IOenParamSetEntity } from './oen-param-set-entity.interface';
import { IOenPictogramEntity } from './oen-pictogram-entity.interface';

export interface IOenParamEntityGenerated extends IEntityBase {

/*
 * BlobsCommentFk
 */
  BlobsCommentFk?: number | null;

/*
 * BlobsNumberCalcRuleFk
 */
  BlobsNumberCalcRuleFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * NumberBuildSum
 */
  NumberBuildSum: boolean;

/*
 * NumberDecimalPlaces
 */
  NumberDecimalPlaces?: number | null;

/*
 * NumberMaxValue
 */
  NumberMaxValue?: number | null;

/*
 * NumberMinValue
 */
  NumberMinValue?: number | null;

/*
 * NumberQuantityDependent
 */
  NumberQuantityDependent: boolean;

/*
 * NumberUnit
 */
  NumberUnit?: string | null;

/*
 * OenBoqItem2Params
 */
  OenBoqItem2Params?: IOenBoqItem2ParamEntity[] | null;

/*
 * OenParamSet
 */
  OenParamSet?: IOenParamSetEntity | null;

/*
 * OenParamSetFk
 */
  OenParamSetFk: number;

/*
 * OenParamValueLists
 */
  OenParamValueLists?: IOenParamValueListEntity[] | null;

/*
 * OenPictogram
 */
  OenPictogram?: IOenPictogramEntity | null;

/*
 * OenPictogramFk
 */
  OenPictogramFk?: number | null;

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

/*
 * Type
 */
  Type: number;
}
