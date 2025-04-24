/*
 * Copyright(c) RIB Software GmbH
 */

import { IPPSEventEntity } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { runInInjectionContext } from '@angular/core';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';

export const PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		containerUuid: 'fb45491e56d64efc9a5d01a3763fa561',
		title: { key: 'transportplanning.package.eventListTitle' },
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ctx.injector.get(TransportplanningPackageDataService);
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ctx.injector.get(TransportplanningPackageDataService);
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	layoutConfiguration: GetPpsEventEntityLayout(),
});
