/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelObjectEntity } from './model-object-entity.interface';
import { IObjectSetEntity } from './object-set-entity.interface';

export interface IObjectSet2ObjectEntityGenerated extends IEntityBase {

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

/*
 * ObjectSetEntity
 */
  ObjectSetEntity?: IObjectSetEntity | null;

/*
 * ObjectSetFk
 */
  ObjectSetFk: number;

/*
 * ProjectFk
 */
  ProjectFk: number;
}
