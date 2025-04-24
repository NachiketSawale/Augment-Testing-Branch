/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { IPPSItemEntity } from './models';

export const PPS_ITEM_PROJECT_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPPSItemEntity>({
	containerUuid: '48de4b8ee6434812a919013cc1b04d42',
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	gridTitle: { key: 'productionplanning.item.projectFormDataLisTitle', text: '*Form Data for Project' },
	rubric: Rubric.Project,
	contextFk: 'ProjectFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},
});