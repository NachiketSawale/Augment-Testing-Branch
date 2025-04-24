/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { PpsUpstreamItemEntityInfoFactory } from '@libs/productionplanning/item';

export const PPS_HEADER_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IPpsHeaderEntity>({
	containerUuid: '23edab99edgb492d84r29947e734fh99',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.upstreamItem.listTitle', text: '*Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsHeaderDataService);
	},
	endPoint: 'listbyppsheader',
	mainItemColumn: 'Id',
	ppsItemColumn: 'NotExistingColumnName', //no ppsitem
	ppsHeaderColumn: 'Id',
});

