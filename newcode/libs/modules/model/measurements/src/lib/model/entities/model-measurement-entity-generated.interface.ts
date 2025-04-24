/*
 * Copyright(c) RIB Software GmbH
 */

import { IModelMeasurementPointEntity } from './model-measurement-point-entity.interface';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IModelMeasurementEntityGenerated extends IEntityBase {

/*
 * Camera
 */
 //Camera?: IIAnnotationCameraEntity | null;

/*
 * Code
 */
  Code: string;

/*
 * Color
 */
  Color?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdlMeasurementGroupEntity
 */
  //MdlMeasurementGroupEntity?: IModelMeasurementGroupEntity | null;

/*
 * MdlMeasurementPointEntities
 */
  MdlMeasurementPointEntities?: IModelMeasurementPointEntity[] | null;

/*
 * MeasurementGroupFk
 */
  MeasurementGroupFk?: number | null;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * Type
 */
  Type: number;

/*
 * Uom
 */
  Uom?: string | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * Value
 */
  Value: number;
}
