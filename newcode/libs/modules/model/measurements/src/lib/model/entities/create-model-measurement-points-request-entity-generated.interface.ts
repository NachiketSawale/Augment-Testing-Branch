/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelMeasurementPointEntity } from './model-measurement-point-entity.interface';

export interface ICreateModelMeasurementPointsRequestEntityGenerated {

/*
 * MeasurementId
 */
  MeasurementId?: number | null;

/*
 * Points
 */
  Points?: IModelMeasurementPointEntity[] | null;
}
