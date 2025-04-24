/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { PpsUpstreamItemDataServiceManager } from '../services/upstream-item/pps-upstream-item-data-service-manager.service';
import { IPPSItemEntity, IPpsUpstreamItemEntity } from './models';

export const PPS_UPSTREAM_ITEM_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPpsUpstreamItemEntity>({
	containerUuid: 'a7cecf4268094d6c9d5a27cdc7bd9dbf',
	permissionUuid: '23edab57edgb492d84r2gv47e734fh8u',
	gridTitle: { key: 'productionplanning.item.upstreamFormDataLisTitle', text: '*Upstream Requirement: Form Data' },
	rubric: Rubric.PPSUpstreamItem,
	parentServiceFn: (ctx) => {
		return PpsUpstreamItemDataServiceManager.getDataService<IPPSItemEntity>({
			containerUuid: '23edab57edgb492d84r2gv47e734fh8u',
			parentServiceFn: (ctx) => {
				return ctx.injector.get(PpsItemDataService);
			},
		}, ctx);
	},
});


