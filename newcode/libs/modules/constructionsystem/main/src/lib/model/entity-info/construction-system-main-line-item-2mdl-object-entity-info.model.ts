/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstLineItem2MdlObjectEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMainLineItem2MdlObjectDataService } from '../../services/construction-system-main-line-item-2mdl-object-data.service';
import { ConstructionSystemMainLineItem2MdlObjectLayoutService } from '../../services/layouts/construction-system-main-line-item-2mdl-object-layout.service';
import { ConstructionSystemMainLineItem2MdlObjectBehavior } from '../../behaviors/construction-system-main-line-item-2mdl-object-behavior.service';

export const CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_2OBJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstLineItem2MdlObjectEntity>({
	grid: {
		title: { key: 'constructionsystem.master.lineItemAssignObjectsContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMainLineItem2MdlObjectBehavior),
	},

	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainLineItem2MdlObjectDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstLineItem2MdlObjectDto' },
	permissionUuid: '64874d07b6b64282889c426595dc49a4',
	layoutConfiguration: async (context) => {
		return context.injector.get(ConstructionSystemMainLineItem2MdlObjectLayoutService).generateLayout();
	},
});

