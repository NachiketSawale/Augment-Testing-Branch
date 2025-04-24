/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { PpsUpstreamItemEntityInfoFactory } from '../services/upstream-item/pps-upstream-item-entity-info-factory.service';
import { PpsUpstreamItemDataServiceManager } from '../services/upstream-item/pps-upstream-item-data-service-manager.service';
import { IPpsUpstreamItemEntity } from './models';

export const PPS_ITEM_SPLIT_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IPpsUpstreamItemEntity>({
	containerUuid: 'a8ed3da9952f456b9becb49949cae4c2',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.splitUpstreamItem.listTitle', text: '*Split Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return PpsUpstreamItemDataServiceManager.getDataService({
			containerUuid: '23edab57edgb492d84r2gv47e734fh8u',
			parentServiceFn: (ctx) => {
				return ctx.injector.get(PpsItemDataService);
			},
		}, ctx);
	},
	endPoint: 'listsplitupstreamitems',
	mainItemColumn: 'Id',
	ppsItemColumn: 'PpsItemFk',
	ppsHeaderColumn: 'PpsHeaderFk',
	deleteSupported: false,
	createSupported: false,
	copySupported: false,
	filterSupported: false,
	splitSupported: false,
});
