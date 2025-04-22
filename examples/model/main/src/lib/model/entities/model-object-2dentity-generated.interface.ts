/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObjectEntity } from './model-object-entity.interface';

export interface IModelObject2DEntityGenerated {

/*
 * Data
 */
  // Data?: IModelObject2DData | null;

/*
 * Geometry
 */
  Geometry?: string | null;

/*
 * IsNegative
 */
  IsNegative?: boolean | null;

/*
 * Layout
 */
  Layout?: string | null;

/*
 * ModelFk
 */
  ModelFk?: number | null;

/*
 * ModelObject
 */
  ModelObject?: IModelObjectEntity | null;

/*
 * ModelObjectFk
 */
  ModelObjectFk?: number | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * Scale
 */
  Scale?: number | null;

/*
 * Setting
 */
  // Setting?: IModelObject2DSetting | null;

/*
 * Template
 */
  // Template?: IModelObject2DTemplate | null;

/*
 * Uuid
 */
  Uuid?: string | null;
}
