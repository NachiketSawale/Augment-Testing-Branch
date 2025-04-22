/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelImportProfileEntity } from './model-import-profile-entity.interface';

export interface IModelDefaultImportProfileEntityGenerated extends IEntityBase {

/*
 * BasCompanyFk
 */
  BasCompanyFk?: number | null;

/*
 * Code
 */
  Code: string;

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
}
