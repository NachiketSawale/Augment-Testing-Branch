/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import {
	IPpsUpstreamItemEntity,
	PpsUpstreamItemDataServiceManager,
	PpsUpstreamItemEntityInfoFactory
} from '@libs/productionplanning/item';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';


export const ENGINEERING_TASK_SPLIT_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IPpsUpstreamItemEntity>({
	containerUuid: '047ac127d3cc41fca3221b897c5bb93f',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.splitUpstreamItem.listTitle', text: '*Split Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return PpsUpstreamItemDataServiceManager.getDataService({
			containerUuid: '33edab57edgb492d84r2gv47e734fh8u',
			parentServiceFn: (ctx) => {
				return ctx.injector.get(EngineeringTaskDataService);
			},
			endPoint: 'list',
			ppsItemColumn: 'PPSItemFk',
			ppsHeaderColumn: 'PPSItem_PpsHeaderFk',
		}, ctx);
	},
	endPoint: 'listsplitupstreamitems',
	mainItemColumn: 'Id',
	ppsItemColumn: 'PPSItemFk',
	deleteSupported: false,
	createSupported: false,
	copySupported: false,
	filterSupported: false,
	splitSupported: false,
});