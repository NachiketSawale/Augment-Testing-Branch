/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IModelImportProfileEntity } from './model-import-profile-entity.interface';
import { IModelImportPropertyKeyRuleEntity } from './model-import-property-key-rule-entity.interface';
import { IModelImportPropertyProcessorEntity } from './model-import-property-processor-entity.interface';

export interface IModelImportProfileComplete extends CompleteIdentification<IModelImportProfileEntity> {

	/*
	 * ImportPropertyKeyRulesToDelete
	 */
	ImportPropertyKeyRulesToDelete?: IModelImportPropertyKeyRuleEntity[] | null;

	/*
	 * ImportPropertyKeyRulesToSave
	 */
	ImportPropertyKeyRulesToSave?: IModelImportPropertyKeyRuleEntity[] | null;

	/*
	 * ImportPropertyProcessorsToDelete
	 */
	ImportPropertyProcessorsToDelete?: IModelImportPropertyProcessorEntity[] | null;

	/*
	 * ImportPropertyProcessorsToSave
	 */
	ImportPropertyProcessorsToSave?: IModelImportPropertyProcessorEntity[] | null;

	/*
	 * MainItemId
	 */
	MainItemId?: number | null;

	/*
	 * ModelImportProfiles
	 */
	ModelImportProfiles?: IModelImportProfileEntity | null;
}
