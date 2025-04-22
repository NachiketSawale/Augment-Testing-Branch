/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { EntityInfo, IBusinessModuleAddOn } from '@libs/ui/business-base';
import { MODEL_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/model/interfaces';
import { MODEL_ENTITY_INFO } from './model-entity-info.model';
import { MODEL_VERSION_ENTITY_INFO } from './model-version-entity-info.model';
import { MODEL_FILE_ENTITY_INFO } from './model-file-entity-info.model';

/**
 * Declarations for the Project module.
 */
@LazyInjectable({
	token: MODEL_PROJECT_MODULE_ADD_ON_TOKEN
})
export class ModelProjectModuleAddOn implements IBusinessModuleAddOn {

	public get entities(): EntityInfo[] {
		return [
			MODEL_ENTITY_INFO,
			MODEL_VERSION_ENTITY_INFO,
			MODEL_FILE_ENTITY_INFO
		];
	}
}
