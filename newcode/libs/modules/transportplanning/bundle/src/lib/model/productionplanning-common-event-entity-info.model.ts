/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { IPPSEventEntity } from '@libs/productionplanning/shared';
import { runInInjectionContext } from '@angular/core';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';

export const PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		title: { key: 'productionplanning.common.event' + '.bundleEventTitle' },
		containerUuid: 'e73c63c80cbb44e7985a19c350405c5b',
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ctx.injector.get(TransportplanningBundleGridDataService);
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ctx.injector.get(TransportplanningBundleGridDataService);
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	layoutConfiguration: GetPpsEventEntityLayout(),
});
