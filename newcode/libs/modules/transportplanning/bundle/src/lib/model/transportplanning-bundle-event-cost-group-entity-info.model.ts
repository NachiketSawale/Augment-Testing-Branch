/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { IPPSEventEntity, PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { get } from 'lodash';

export const TRANSPORTPLANNING_BUNDLE_EVENT_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IPPSEventEntity>({
	containerUuid: 'ddvhyf94asdcvf17ty967dddf25t5cty',
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	gridTitle: { key: 'productionplanning.common.event.bundleEventCostGroupTitle' },
	apiUrl: 'transportplanning/bundle/bundle',
	dataLookupType: 'TrsBundle2CostGroups',
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
