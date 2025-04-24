import { EntityInfo } from '@libs/ui/business-base';
import { IPPSEventEntity, PpsEntity } from '@libs/productionplanning/shared';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { runInInjectionContext } from '@angular/core';
import { ProductionplanningProductionsetDataService } from '../services/productionplanning-productionset-data.service';

export const PPS_PRODUCTIONSET_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		containerUuid: '123e3750bcbf4d2580f02e3a34bb5yut',
		title: { key: 'productionplanning.common.event.productionSetEventTitle' },
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ctx.injector.get(ProductionplanningProductionsetDataService);
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	permissionUuid: '123e3750bcbf4d2580f02e3a34bb5yut',
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ctx.injector.get(ProductionplanningProductionsetDataService);
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	layoutConfiguration: GetPpsEventEntityLayout({
		PpsEntity: PpsEntity.PPSProductionSet,
	}),
});
