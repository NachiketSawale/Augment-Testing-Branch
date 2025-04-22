/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelObjectEntity } from './model-object-entity.interface';

export interface IModelObject3DEntityGenerated extends IEntityBase {

/*
 * Color
 */
  Color?: number | null;

/*
 * Geometry
 */
  Geometry: string;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * ModelObjectEntity
 */
  ModelObjectEntity?: IModelObjectEntity | null;

/*
 * ModelObjectFk
 */
  ModelObjectFk: number;

/*
 * Opacity
 */
  Opacity?: number | null;

/*
 * Visibility
 */
  Visibility: boolean;
}
