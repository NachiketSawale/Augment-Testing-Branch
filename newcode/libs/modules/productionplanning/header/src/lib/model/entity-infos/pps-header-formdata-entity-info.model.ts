/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';

export const PPS_HEADER_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPpsHeaderEntity>({
	containerUuid: '5c5d31d1de514feea77e7f5f785830bd',
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	gridTitle: { key: 'productionplanning.item.projectFormDataLisTitle', text: '*Form Data for Project' },
	rubric: Rubric.Project,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsHeaderDataService);
	},
});

