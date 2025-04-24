/*
 * Copyright(c) RIB Software GmbH
 */
/* wait for implmentation of PlanningUnit Products container and PlanningUnit Product Events container !!!

import { PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { IPPSEventEntity, PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { get } from 'lodash';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_PRODUCT_EVENT_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IPPSEventEntity>({
	containerUuid: '56vhyf94asdcvf17ty967dgaf25t5cty',
	permissionUuid: 'b51857fedc364b9f87102fcb6988bf7b',
	gridTitle: { key: 'productionplanning.item.ppsProductCostGroupListTitle', text: '*Product Event: Cost Groups' },
	apiUrl: 'productionplanning/common/product',
	dataLookupType: 'PpsProduct2CostGroups',
	parentServiceFn: (ctx) => {
		const grandParentDataService = ctx.injector.get(PpsItemDataService);
		//const parentDataService = ctx.injector.get(PpsItemProductDataService);
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