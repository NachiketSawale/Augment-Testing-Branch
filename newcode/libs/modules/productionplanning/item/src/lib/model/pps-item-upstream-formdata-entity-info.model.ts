/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_UPSTREAM_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPPSItemEntity>({
	apiUrl: 'productionplanning/item/upstreamitem',
	containerUuid: '25dab18e4888412c978c011267ec1dfe',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { key: 'productionplanning.item.upstreamFormDataListTitle', text: '*Planning Unit: Upstream Result Form Data' },
	rubric: Rubric.PPSUpstreamItem,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
	deleteSupported: false,
	createSupported: false,
});


