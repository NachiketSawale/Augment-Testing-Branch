/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { IPPSEventEntity, PpsEntity } from '@libs/productionplanning/shared';
import { ProductionplanningCommonProductBundleDataService } from '../services/productionplanning-common-product-bundle-data.service';
import { runInInjectionContext } from '@angular/core';
import { GetPpsEventEntityLayout, PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';

export const PRODUCTIONPLANNING_COMMON_PRODUCT_EVENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPPSEventEntity>({
	grid: {
		containerUuid: '30f34f65c4054f6591d586173bdb9cb0',
		title: { key: 'productionplanning.common' + '.event.bundleProductEventTitle' },
		behavior: (ctx) =>
			runInInjectionContext(ctx.injector, () => {
				const parentDataService = ProductionplanningCommonProductBundleDataService.getInstance('TransportPlanning.Bundle', ctx.injector.get(TransportplanningBundleGridDataService));
				return PpsCommonEventDataServiceFactory.GetBehavior(parentDataService);
			}),
	},
	dataService: (ctx) =>
		runInInjectionContext(ctx.injector, () => {
			const parentDataService = ProductionplanningCommonProductBundleDataService.getInstance('TransportPlanning.Bundle', ctx.injector.get(TransportplanningBundleGridDataService));
			return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
		}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Common', typeName: 'EventDto' },
	permissionUuid: 'f2a029fd6b984f828c87bfcb60b37d8f',
	layoutConfiguration: GetPpsEventEntityLayout({ PpsEntity: PpsEntity.PPSProduct }),
});
