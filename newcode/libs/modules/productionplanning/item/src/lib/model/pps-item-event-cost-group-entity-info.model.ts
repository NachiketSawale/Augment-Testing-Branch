/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsCommonEventDataServiceFactory } from '@libs/productionplanning/common';
import { IPPSEventEntity, PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { get } from 'lodash';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_EVENT_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IPPSEventEntity>({
	containerUuid: 'dfvhyf94a1ghvf17ty967dgaf25t5cgj',
	permissionUuid: '5d32c2debd3646ab8ef0457135d35624',
	gridTitle: { key: 'productionplanning.item.ppsItemCostGroupListTitle', text: '*Production Unit Event: Cost Groups' },
	apiUrl: 'productionplanning/item',
	dataLookupType: 'PpsItem2CostGroups',
	parentServiceFn: (ctx) => {
		const parentDataService = ctx.injector.get(PpsItemDataService);
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
