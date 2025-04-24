/*
 * Copyright(c) RIB Software GmbH
 */
/* wait for implmentation of PlanningUnit Packages container and PlanningUnit Package Events container !!!

import { PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { IPPSEventEntity, PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { get } from 'lodash';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_PRODUCT_EVENT_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IPPSEventEntity>({
	containerUuid: '67ghjf94asdcvf17ty967dgdfg5t5cty',
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	gridTitle: { key: 'transportplanning.package.eventCostGroupListTitle', text: '*Package event: Cost Groups' },
	apiUrl: 'transportplanning/package',
	dataLookupType: 'TrsPackage2CostGroups',
	parentServiceFn: (ctx) => {
		const grandParentDataService = ctx.injector.get(PpsItemDataService);
		//const parentDataService = ctx.injector.get(PpsItemPakcageDataService);
		return PpsCommonEventDataServiceFactory.GetDataService(parentDataService);
	},
	provideReadDataFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'ProjectFk'),
			PKey2: get(selectedParent, 'Id'), // pps event Id
		};
	},
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'Id') as unknown as number;
	}

});
*/