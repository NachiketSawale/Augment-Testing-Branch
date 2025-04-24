/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IModelEntity } from './model-entity.interface';
import { IModelFileEntity } from './model-file-entity.interface';

export interface IModelComplete extends CompleteIdentification<IModelEntity> {

	/**
	 * The model to update.
	 */
	Models?: IModelEntity | null;

	/**
	 * The model files to save.
	 */
	ModelFilesToSave?: IModelFileEntity[] | null;

	/**
	 * The model files to delete.
	 */
	ModelFilesToDelete?: IModelFileEntity[] | null;
}
