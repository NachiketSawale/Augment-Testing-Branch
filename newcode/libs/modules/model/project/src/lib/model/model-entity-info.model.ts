/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IModelEntity } from './entities/model-entity.interface';
import { ModelProjectModelDataService } from '../services/model-data.service';
import { ModelProjectModelBehaviorService } from '../behaviors/model-behavior.service';
import { MODEL_LAYOUT_CONFIGURATION } from './model-layout-configuration.model';

export const MODEL_ENTITY_INFO = EntityInfo.create<IModelEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Project',
		typeName: 'ModelDto'
	},
	permissionUuid: 'd4d807d4047e439d9ba536d7114e9009',
	grid: {
		title: {key: 'model.project.modelListContainer'}
	},
	form: {
		containerUuid: '8a10e1cb69774d56926abd47c0c8dca9',
		title: {key: 'model.project.modelDetailContainer'}
	},
	containerBehavior: ctx => ctx.injector.get(ModelProjectModelBehaviorService),
	dataService: ctx => ctx.injector.get(ModelProjectModelDataService),
	layoutConfiguration: MODEL_LAYOUT_CONFIGURATION
});
