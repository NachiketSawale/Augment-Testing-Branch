/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainInstance2ObjectDataService } from '../../services/construction-system-main-instance2-object-data.service';
import { ConstructionSystemMainInstance2ObjectBehavior } from '../../behaviors/construction-system-main-instance2-object-behavior.service';
import { IInstance2ObjectEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstance2ObjectLayoutService } from '../../services/layouts/construction-system-main-instance2-object-layout.service';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IInstance2ObjectEntity>({
	grid: {
		title: { key: 'constructionsystem.main.instance2ObjectGridTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMainInstance2ObjectBehavior),
	},
	form: {
		title: { key: 'constructionsystem.main.Instance2ObjectFormTitle' },
		containerUuid: 'eb95f95117704afe8a18f56027701bfd',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainInstance2ObjectDataService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'Instance2ObjectDto' },
	permissionUuid: '64a9c61d23064f13bb51fcad27932e2b',
	layoutConfiguration: (context) => {
		return context.injector.get(ConstructionSystemMainInstance2ObjectLayoutService).generateLayout(context);
	},
	//dragDropService:constructionSystemMainClipboardService todo
});
