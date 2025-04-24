/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObject3DEntity } from './model-object-3dentity.interface';
import { IModelObject2LocationEntity } from './model-object-2location-entity.interface';
import { IViewpointEntity } from './viewpoint-entity.interface';
import { IObjectSet2ObjectEntity } from './object-set-2object-entity.interface';
import { IObjectSetEntity } from './object-set-entity.interface';
import { IModelObjectEntity } from './model-object-entity.interface';
import { IPropertyEntity } from './property-entity.interface';
import { ViewpointComplete } from '../../viewpoint/model/viewpoint-complete.class';
import { ObjectSetComplete } from '../object-set-complete.class';

export interface IModelUpdateEntityGenerated {

/*
 * ContributionsToSave
 */
  // ContributionsToSave?: IIIdentifyable[] | null;

/*
 * CostGroupToDelete
 */
  // CostGroupToDelete?: IMainItem2CostGroupEntity[] | null;

/*
 * CostGroupToSave
 */
  // CostGroupToSave?: IMainItem2CostGroupEntity[] | null;

/*
 * EstLineItem2ObjectToDelete
 */
  // EstLineItem2ObjectToDelete?: IIIdentifyable[] | null;

/*
 * EstLineItem2ObjectToSave
 */
  // EstLineItem2ObjectToSave?: IIIdentifyable[] | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * Model3DObjectsToDelete
 */
  Model3DObjectsToDelete?: IModelObject3DEntity[] | null;

/*
 * Model3DObjectsToSave
 */
  Model3DObjectsToSave?: IModelObject3DEntity[] | null;

/*
 * ModelObject2LocationsToDelete
 */
  ModelObject2LocationsToDelete?: IModelObject2LocationEntity[] | null;

/*
 * ModelObject2LocationsToSave
 */
  ModelObject2LocationsToSave?: IModelObject2LocationEntity[] | null;

/*
 * ModelViewpointsToDelete
 */
  ModelViewpointsToDelete?: IViewpointEntity[] | null;

/*
 * ModelViewpointsToSave
 */
  ModelViewpointsToSave?: ViewpointComplete[] | null;

/*
 * ObjectSet2ObjectToDelete
 */
  ObjectSet2ObjectToDelete?: IObjectSet2ObjectEntity[] | null;

/*
 * ObjectSet2ObjectToSave
 */
  ObjectSet2ObjectToSave?: IObjectSet2ObjectEntity[] | null;

/*
 * ObjectSetToDelete
 */
  ObjectSetToDelete?: IObjectSetEntity[] | null;

/*
 * ObjectSetToSave
 */
  ObjectSetToSave?: ObjectSetComplete[] | null;

/*
 * Objects
 */
  Objects?: IModelObjectEntity[] | null;

/*
 * PropertiesToDelete
 */
  PropertiesToDelete?: IPropertyEntity[] | null;

/*
 * PropertiesToSave
 */
  PropertiesToSave?: IPropertyEntity[] | null;

/*
 * RequestToDelete
 */
  // RequestToDelete?: IIIdentifyable[] | null;

/*
 * RequestToSave
 */
  // RequestToSave?: IIdentifyable[] | null;
}
