/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainLineItemDataService } from '../../services/construction-system-main-line-item-data.service';
import { ConstructionSystemMainLineItemBehavior } from '../../behaviors/construction-system-main-line-item-behavior.service';
import { ConstructionSystemMainLineItemLayoutService } from '../../services/layouts/construction-system-main-lineitem-layout.service';
import {ICosEstLineItemEntity} from '../entities/cos-est-lineitem-entity.interface';
export const CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosEstLineItemEntity>({
	grid: {
		title: { key: 'constructionsystem.master.lineItemContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMainLineItemBehavior),
	},

	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainLineItemDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto' },
	permissionUuid: 'efec989037bc431187bf166fc31666a0',
	layoutConfiguration: async (context) => {
		return context.injector.get(ConstructionSystemMainLineItemLayoutService).generateLayout();
	},
});
