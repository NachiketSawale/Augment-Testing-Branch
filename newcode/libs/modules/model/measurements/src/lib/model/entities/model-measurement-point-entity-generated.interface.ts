/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IModelMeasurementEntity } from './model-measurement-entity.interface';

export interface IModelMeasurementPointEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdlMeasurementEntity
 */
  MdlMeasurementEntity?: IModelMeasurementEntity | null;

/*
 * MeasurementFk
 */
  MeasurementFk: number;

/*
 * PosX
 */
  PosX: number;

/*
 * PosY
 */
  PosY: number;

/*
 * PosZ
 */
  PosZ: number;

/*
 * Sorting
 */
  Sorting: number;
}
