import { EntityInfo } from '@libs/ui/business-base';
import { IPPSEventEntity, PpsEntity } from '@libs/productionplanning/shared';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { runInInjectionContext } from '@angular/core';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		containerUuid: '5d32c2debd3646ab8ef0457135d35624',
		title: { key: 'productionplanning.common.event.itemEventTitle' },
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ctx.injector.get(PpsItemDataService);
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ctx.injector.get(PpsItemDataService);
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	layoutConfiguration: GetPpsEventEntityLayout({ PpsEntity: PpsEntity.PPSItem }),
});
