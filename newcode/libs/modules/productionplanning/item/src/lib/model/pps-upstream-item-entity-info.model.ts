/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IPPSItemEntity} from './entities/pps-item-entity.interface';
import { PpsUpstreamItemEntityInfoFactory } from '../services/upstream-item/pps-upstream-item-entity-info-factory.service';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '23edab57edgb492d84r2gv47e734fh8u',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.upstreamItem.listTitle', text: '*Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},

});

