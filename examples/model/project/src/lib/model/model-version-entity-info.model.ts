/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IModelEntity } from './entities/model-entity.interface';
import { ModelProjectModelVersionDataService } from '../services/model-version-data.service';
import { ModelProjectModelVersionBehaviorService } from '../behaviors/model-version-behavior.service';
import { MODEL_LAYOUT_CONFIGURATION } from './model-layout-configuration.model';

export const MODEL_VERSION_ENTITY_INFO = EntityInfo.create<IModelEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Project',
		typeName: 'ModelDto'
	},
	permissionUuid: 'd4d807d4047e439d9ba536d7114e9009',
	grid: {
		containerUuid: 'd5d4776c5ea64701912a9c8b007ec446',
		title: { key: 'model.project.modelVersionListContainer' }
	},
	form: {
		containerUuid: 'a16d5eb0ec314c00871308b03f4a1c39',
		title: { key: 'model.project.modelVersionDetailContainer' }
	},
	containerBehavior: ctx => ctx.injector.get(ModelProjectModelVersionBehaviorService),
	dataService: ctx => ctx.injector.get(ModelProjectModelVersionDataService),
	layoutConfiguration: MODEL_LAYOUT_CONFIGURATION
});