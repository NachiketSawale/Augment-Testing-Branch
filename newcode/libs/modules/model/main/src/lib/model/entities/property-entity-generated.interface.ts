/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObject2PropertyEntity } from './object-2property-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPropertyEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * IsCustom
 */
  IsCustom?: boolean | null;

/*
 * IsInherited
 */
  IsInherited?: boolean | null;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * Object2PropertyEntities
 */
  Object2PropertyEntities?: IObject2PropertyEntity[] | null;

/*
 * PropertyKeyFk
 */
  PropertyKeyFk?: number | null;

/*
 * PropertyValueBool
 */
  PropertyValueBool: boolean;

/*
 * PropertyValueDate
 */
  PropertyValueDate: string;

/*
 * PropertyValueLong
 */
  PropertyValueLong: number;

/*
 * PropertyValueNumber
 */
  PropertyValueNumber: number;

/*
 * PropertyValueText
 */
  PropertyValueText?: string | null;

/*
 * UoM
 */
  UoM?: string | null;

/*
 * UoMFk
 */
  UoMFk?: number | null;

/*
 * ValueType
 */
  ValueType?: 'String' | 'Decimal' | 'Integer' | 'Boolean' | 'DateTime' | null;
}
