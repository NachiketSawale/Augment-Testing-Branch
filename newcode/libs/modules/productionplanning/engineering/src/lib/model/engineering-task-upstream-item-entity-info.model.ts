/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { PpsUpstreamItemEntityInfoFactory } from '@libs/productionplanning/item';
import { IEngTaskEntity } from './entities/eng-task-entity.interface';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';


export const ENGINEERING_TASK_UPSTREAM_ITEM_ENTITY_INFO: EntityInfo = PpsUpstreamItemEntityInfoFactory.create<IEngTaskEntity>({
	containerUuid: '33edab57edgb492d84r2gv47e734fh8u',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.upstreamItem.listTitle', text: '*Upstream Requirements' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
	endPoint: 'list',
	ppsItemColumn: 'PPSItemFk',
	ppsHeaderColumn: 'PPSItem_PpsHeaderFk',
});
