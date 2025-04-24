/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsUpstreamItemEntityInfoFactory, IPpsUpstreamItemEntity, PpsUpstreamItemDataServiceManager } from '@libs/productionplanning/item';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';

export const PPS_HEADER_SPLIT_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IPpsUpstreamItemEntity>({
	containerUuid: '7fff4a90a51841a899e98aca1bf5c04c',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.splitUpstreamItem.listTitle', text: '*Split Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return PpsUpstreamItemDataServiceManager.getDataService({
			containerUuid: '23edab99edgb492d84r29947e734fh99',
			parentServiceFn: (ctx) => {
				return ctx.injector.get(PpsHeaderDataService);
			},
			endPoint: 'listbyppsheader',
			mainItemColumn: 'Id',
			ppsItemColumn: 'NotExistingColumnName',
			ppsHeaderColumn: 'Id',
		}, ctx);
	},
	endPoint: 'listsplitupstreamitems',
	mainItemColumn: 'Id',
	ppsItemColumn: 'PPSItemFk',
	ppsHeaderColumn: 'PpsHeaderFk',
	deleteSupported: false,
	createSupported: false,
	copySupported: false,
	filterSupported: false,
	splitSupported: false,
});