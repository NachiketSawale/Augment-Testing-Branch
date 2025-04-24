/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelObjectEntity } from './model-object-entity.interface';

export interface IModelObject2CostGroupEntityGenerated extends IEntityBase {

/*
 * CostGroupCatFk
 */
  CostGroupCatFk: number;

/*
 * CostGroupFk
 */
  CostGroupFk: number;

/*
 * Id
 */
  Id: number;

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
