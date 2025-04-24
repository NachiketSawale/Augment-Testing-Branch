/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMasterLineItemDataService } from '../../services/construction-system-master-line-item-data.service';
import { ConstructionSystemMasterLineItemBehavior } from '../../behaviors/construction-system-master-line-item-behavior.service';
import { ConstructionSystemMasterLineItemLayoutService } from '../../services/layouts/construction-system-master-line-item-layout.service';

export const CONSTRUCTION_SYSTEM_MASTER_LINE_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstLineItemEntity>({
	grid: {
		title: { key: 'constructionsystem.master.lineItemContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterLineItemBehavior),
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterLineItemDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterLineItemLayoutService).generateLayout(),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto' },
	permissionUuid: '6a4caeb75ca542d8af545196f3948d3d',
});
