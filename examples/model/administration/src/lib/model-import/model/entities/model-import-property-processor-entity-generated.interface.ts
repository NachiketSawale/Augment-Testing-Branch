/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IPropertyKeyEntity } from '../../../property-keys/model/entities/property-key-entity.interface';
import { IModelImportProfileEntity } from './model-import-profile-entity.interface';

export interface IModelImportPropertyProcessorEntityGenerated extends IEntityBase {

/*
 * CleanUp
 */
  CleanUp: boolean;

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
 * Overwrite
 */
  Overwrite: boolean;

/*
 * ProcessorKey
 */
  ProcessorKey: string;

/*
 * PropertyKeyEntity
 */
  PropertyKeyEntity?: IPropertyKeyEntity | null;

/*
 * PropertyKeyFk
 */
  PropertyKeyFk: number;

/*
 * Sorting
 */
  Sorting: number;

/*
 * UseInheritance
 */
  UseInheritance: boolean;
}
