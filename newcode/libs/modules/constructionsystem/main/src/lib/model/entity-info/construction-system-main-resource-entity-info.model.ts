/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainResourceDataService } from '../../services/construction-system-main-resource-data.service';
import { ICosEstResourceEntity } from '../entities/cos-est-resource-entity.interface';
import { ConstructionSystemMainResourceLayoutService } from '../../services/layouts/construction-system-main-resource-layout.service';

export const CONSTRUCTION_SYSTEM_MAIN_RESOURCE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosEstResourceEntity>({
	grid: {
		title: { key: 'constructionsystem.master.resourceContainerTitle' },
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	permissionUuid: '51543C12BB2D4888BC039A5958FF8B96',
	layoutConfiguration: async (context) => {
		return context.injector.get(ConstructionSystemMainResourceLayoutService).generateLayout();
	},
});
