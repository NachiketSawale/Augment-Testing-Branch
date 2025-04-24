/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObjectEntity } from './model-object-entity.interface';
import { IPropertyEntity } from './property-entity.interface';

export interface IObject2PropertyEntityGenerated {

/*
 * IsCustom
 */
  IsCustom: boolean;

/*
 * IsInherited
 */
  IsInherited: boolean;

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
 * PropertyEntity
 */
  PropertyEntity?: IPropertyEntity | null;

/*
 * PropertyFk
 */
  PropertyFk: number;

/*
 * PropertyKeyFk
 */
  PropertyKeyFk: number;
}
