/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenBoqItemEntity } from './oen-boq-item-entity.interface';
import { IOenParamEntity } from './oen-param-entity.interface';

export interface IOenBoqItem2ParamEntityGenerated extends IEntityBase {

/*
 * Annotation
 */
  Annotation?: string | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * IsListValue
 */
  IsListValue: boolean;

/*
 * OenBoqItem
 */
  OenBoqItem?: IOenBoqItemEntity | null;

/*
 * OenParam
 */
  OenParam?: IOenParamEntity | null;

/*
 * OenParamFk
 */
  OenParamFk: number;

/*
 * ValueBoolean
 */
  ValueBoolean?: boolean | null;

/*
 * ValueDate
 */
  ValueDate?: string | null;

/*
 * ValueNumber
 */
  ValueNumber?: number | null;

/*
 * ValueText
 */
  ValueText?: string | null;

/*
 * ValueTextBlobsFk
 */
  ValueTextBlobsFk?: number | null;
}
