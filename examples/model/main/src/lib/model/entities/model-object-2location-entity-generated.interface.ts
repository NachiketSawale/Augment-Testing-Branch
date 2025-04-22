/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelObjectEntity } from './model-object-entity.interface';

export interface IModelObject2LocationEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * LocationFk
 */
  LocationFk: number;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * ModelObjectEntity
 */
  ModelObjectEntity?: IModelObjectEntity | null;

/*
 * ObjectFk
 */
  ObjectFk: number;
}
