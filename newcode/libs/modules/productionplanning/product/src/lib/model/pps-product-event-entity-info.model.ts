import { EntityInfo } from '@libs/ui/business-base';
import { IPPSEventEntity, PpsEntity } from '@libs/productionplanning/shared';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { runInInjectionContext } from '@angular/core';
import { PpsProductDataService } from '../services/pps-product-data.service';

export const PPS_PRODUCT_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		containerUuid: 'c93e350db3a84464881b0b4c9e004f69',
		title: { key: 'productionplanning.common.event.listTitle' },
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ctx.injector.get(PpsProductDataService);
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ctx.injector.get(PpsProductDataService);
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	layoutConfiguration: GetPpsEventEntityLayout({ PpsEntity: PpsEntity.PPSProduct }),
});
