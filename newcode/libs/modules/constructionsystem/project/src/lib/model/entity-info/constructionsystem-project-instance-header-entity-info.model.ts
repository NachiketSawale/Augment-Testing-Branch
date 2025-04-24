/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { constructionSystemProjectInstanceHeaderService } from '../../services/instance-header.service';
import { constructionSystemProjectInstanceHeaderLayoutService } from '../../services/layouts/instance-header-layout.service';
import { constructionSystemProjectInstanceHeaderBehavior } from '../../services/behaviors/instance-header-behavior.service';

/**
 * @brief Entity information for the constructionsystem project instance header.
 *
 * This constant defines the entity information for the constructionsystem project instance header, including the
 * grid configurations, data service, DTO scheme ID, permission UUID, and layout configuration.
 */
export const CONSTRUCTION_SYSTEM_PROJECT_INSTANCE_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<IInstanceHeaderEntity>({
	grid: {
		title: { text: 'COS Instance Headers', key: 'constructionsystem.project.instanceHeaderGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(constructionSystemProjectInstanceHeaderBehavior),
	},
	dataService: (ctx) => ctx.injector.get(constructionSystemProjectInstanceHeaderService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Project', typeName: 'InstanceHeaderDto' },
	permissionUuid: 'f3044885941741b8a9c0c8eea34fb647',
	layoutConfiguration: (context) => {
		return context.injector.get(constructionSystemProjectInstanceHeaderLayoutService).generateLayout();
	},
});
