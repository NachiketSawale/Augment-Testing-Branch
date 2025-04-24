/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '993907f3c548473999eafd1df7e26032',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { key: 'productionplanning.item.formDataLisTitle', text: '*Planning Unit: Form Data' },
	rubric: Rubric.ProductionUnit,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});

