/*
 * Copyright(c) RIB Software GmbH
 */

import { IPPSEventEntity, PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { get } from 'lodash';
import { PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';

export const TRANSPORTPLANNING_BUNDLE_PRODUCT_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IPPSEventEntity>({
	containerUuid: '12vhyf94asdcvf134y967dgaf25t5cty',
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	gridTitle: { key: 'productionplanning.item.ppsProductCostGroupListTitle' },
	apiUrl: 'productionplanning/common/product',
	dataLookupType: 'PpsProduct2CostGroups',
	parentServiceFn: (ctx) => {
		const parentDataService = ctx.injector.get(TransportplanningBundleGridDataService);
		return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
	},
	provideReadDataFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'ProjectFk'),
			PKey2: get(selectedParent, 'Id'),
		};
	},
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'Id') as unknown as number;
	},
});
