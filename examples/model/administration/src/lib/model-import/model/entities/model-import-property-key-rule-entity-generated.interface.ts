/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IModelImportProfileEntity } from './model-import-profile-entity.interface';
import { IPropertyKeyEntity } from '../../../property-keys/model/entities/property-key-entity.interface';

export interface IModelImportPropertyKeyRuleEntityGenerated extends IEntityBase {

/*
 * BaseValueTypeNewFk
 */
  BaseValueTypeNewFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * ModelImportProfileEntity
 */
  ModelImportProfileEntity?: IModelImportProfileEntity | null;

/*
 * ModelImportProfileFk
 */
  ModelImportProfileFk: number;

/*
 * NamePattern
 */
  NamePattern?: string | null;

/*
 * NewName
 */
  NewName?: string | null;

/*
 * NewValue
 */
  NewValue?: string | null;

/*
 * NewValueType
 */
  NewValueType?: string | null;

/*
 * PatternTypeFk
 */
  PatternTypeFk: number;

/*
 * PkTagIds
 */
  PkTagIds?: number[] | null;

/*
 * PropertyKeyEntity
 */
  PropertyKeyEntity?: IPropertyKeyEntity | null;

/*
 * PropertyKeyNewFk
 */
  PropertyKeyNewFk?: number | null;

/*
 * Sorting
 */
  Sorting: number;

/*
 * StopProcessing
 */
  StopProcessing: boolean;

/*
 * Suppress
 */
  Suppress: boolean;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * ValuePattern
 */
  ValuePattern?: string | null;

/*
 * ValueTypeNewFk
 */
  ValueTypeNewFk?: number | null;

/*
 * ValueTypePattern
 */
  ValueTypePattern?: string | null;
}
