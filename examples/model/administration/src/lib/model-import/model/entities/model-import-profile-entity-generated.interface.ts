/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IModelDefaultImportProfileEntity } from './model-default-import-profile-entity.interface';
import { IModelImportPropertyKeyRuleEntity } from './model-import-property-key-rule-entity.interface';
import { IModelImportPropertyProcessorEntity } from './model-import-property-processor-entity.interface';

export interface IModelImportProfileEntityGenerated extends IEntityBase {

/*
 * BasCompanyFk
 */
  BasCompanyFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * ModelDefaultImportProfileEntities
 */
  ModelDefaultImportProfileEntities?: IModelDefaultImportProfileEntity[] | null;

/*
 * ModelImportPropertyKeyRuleEntities
 */
  ModelImportPropertyKeyRuleEntities?: IModelImportPropertyKeyRuleEntity[] | null;

/*
 * ModelImportPropertyProcessorEntities
 */
  ModelImportPropertyProcessorEntities?: IModelImportPropertyProcessorEntity[] | null;

/*
 * RemarkInfo
 */
  RemarkInfo?: IDescriptionInfo | null;

/*
 * Scope
 */
  Scope?: string | null;

/*
 * ShortenLongValues
 */
  ShortenLongValues: boolean;
}
