/*
 * Copyright(c) RIB Software GmbH
 */

import { IModelMeasurementPointEntity } from './model-measurement-point-entity.interface';
import { IModelMeasurementEntity } from './model-measurement-entity.interface';

/**
 * Represents the complete data managed in the model.measurements module.
 */
export interface IModelMeasurementCompleteEntity {

 /*
  * Id
  */
   //Id?: number | null = 10;

 /*
  * ModelMeasurementPointsToDelete
  */
	ModelMeasurementPointsToDelete?: IModelMeasurementPointEntity[] | null;

 /*
  * ModelMeasurementPointsToSave
  */
  ModelMeasurementPointsToSave?: IModelMeasurementPointEntity[] | null;

 /*
  * ModelMeasurements
  */
  ModelMeasurements?: IModelMeasurementEntity | null;

 /*
  * ModelMeasurementsGroup
  */
  //ModelMeasurementsGroup?: IModelMeasurementGroupEntity | null;

 /*
  * ModelMeasurementsToDelete
  */
  ModelMeasurementsToDelete?: IModelMeasurementEntity[] | null;

 /*
  * ModelMeasurementsToSave
  */
  ModelMeasurementsToSave?: IModelMeasurementEntity[] | null;
}
