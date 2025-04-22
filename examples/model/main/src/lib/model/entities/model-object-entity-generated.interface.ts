/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObjectEntity } from './model-object-entity.interface';
import { IModelObject2CostGroupEntity } from './model-object-2cost-group-entity.interface';
import { IModelObject2LocationEntity } from './model-object-2location-entity.interface';
import { IObject2PropertyEntity } from './object-2property-entity.interface';
import { IObjectSet2ObjectEntity } from './object-set-2object-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IModelObject3DEntity } from './model-object-3dentity.interface';

export interface IModelObjectEntityGenerated extends IEntityBase {

/*
 * CadIdInt
 */
  CadIdInt?: number | null;

/*
 * Children
 */
  Children?: IModelObjectEntity[] | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * CpiId
 */
  CpiId?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IdString
 */
  IdString?: string | null;

/*
 * IsComposite
 */
  IsComposite: boolean;

/*
 * IsDeleted
 */
  IsDeleted: boolean;

/*
 * IsNegative
 */
  IsNegative: boolean;

/*
 * IsOpeningParent
 */
  IsOpeningParent: boolean;

/*
 * LocationIds
 */
  LocationIds?: number[] | null;

/*
 * MdlObject2costgrpEntities
 */
  MdlObject2costgrpEntities?: IModelObject2CostGroupEntity[] | null;

/*
 * MeshId
 */
  MeshId?: number | null;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * ModelObject3DEntity
 */
  ModelObject3DEntity?: IModelObject3DEntity | null;

/*
 * ModelObjectEntities_ModelFk_MdlObjectFk
 */
  ModelObjectEntities_ModelFk_MdlObjectFk?: IModelObjectEntity[] | null;

/*
 * ModelObjectEntity_ModelFk_MdlObjectFk
 */
  ModelObjectEntity_ModelFk_MdlObjectFk?: IModelObjectEntity | null;

/*
 * Object2LocationEntities
 */
  Object2LocationEntities?: IModelObject2LocationEntity[] | null;

/*
 * Object2PropertyEntities
 */
  Object2PropertyEntities?: IObject2PropertyEntity[] | null;

/*
 * ObjectFk
 */
  ObjectFk?: number | null;

/*
 * ObjectSet2ObjectEntities
 */
  ObjectSet2ObjectEntities?: IObjectSet2ObjectEntity[] | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;
}
