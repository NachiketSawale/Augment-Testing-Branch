/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelMeasurementEntity } from './model-measurement-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IModelMeasurementGroupEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdlMeasurementEntities
 */
  MdlMeasurementEntities?: IModelMeasurementEntity[] | null;

/*
 * MeasurementGroupFk
 */
  MeasurementGroupFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Visible
 */
  Visible: boolean;
}
