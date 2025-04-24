/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningSharedDocumentDataServiceManager, ProductionplanningShareDocumentRevisionEntityInfoFactory } from '@libs/productionplanning/shared';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';

export const ENGINEERING_TASK_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: '0629bbb864524d6ba3cb9abf9b7dc19c',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.engineering.documentRevisionListTitle', text: '*Engineering Task:Document Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '054db6905e81420e9d848148e6bd1d2b',
			foreignKey: 'EngTaskFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(EngineeringTaskDataService),
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},
});
