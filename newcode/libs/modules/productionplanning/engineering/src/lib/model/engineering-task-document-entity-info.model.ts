/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { IEngTaskEntity } from './entities/eng-task-entity.interface';
import { IInitializationContext } from '@libs/platform/common';

export const ENGINEERING_TASK_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IEngTaskEntity /*, EngDrawingComplete */>({
	containerUuid: '054db6905e81420e9d848148e6bd1d2b',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.engineering.documentListTitle', text: '*Engineering Task:Documents' },
	foreignKey: 'EngTaskFk',
	// moduleName: 'productionplanning.drawing.ppsdocument',
	instantPreview: true,
	parentServiceFn: (context: IInitializationContext) => context.injector.get(EngineeringTaskDataService),
});
