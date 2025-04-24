/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IResourceTypeEntity } from "./resource-type-entity.interface";

export interface IPlantGroup2ResTypeEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * PlantGroupFk
 */
  PlantGroupFk?: number | null;

/*
 * ResTypeFk
 */
  ResTypeFk?: number | null;

/*
 * ResourceTypeEntity
 */
  ResourceTypeEntity?: IResourceTypeEntity | null;
}
