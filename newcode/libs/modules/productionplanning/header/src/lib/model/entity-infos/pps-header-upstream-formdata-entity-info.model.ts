/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';
import { PpsFormdataEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { IPpsUpstreamItemEntity, PpsUpstreamItemDataServiceManager } from '@libs/productionplanning/item';

export const PPS_HEADER_UPSTREAM_FORMDATA_ENTITY_INFO: EntityInfo = PpsFormdataEntityInfoFactory.create<IPpsUpstreamItemEntity>({
	containerUuid: '025b01a229af4e268a59360aba2e00b3',
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	gridTitle: { key: 'productionplanning.item.upstreamFormDataLisTitle', text: '*Upstream Requirement: Form Data' },
	rubric: Rubric.PPSUpstreamItem,
	parentServiceFn: (ctx) => {
		return PpsUpstreamItemDataServiceManager.getDataService<IPpsHeaderEntity>({
			containerUuid: '23edab99edgb492d84r29947e734fh99',
			parentServiceFn: (ctx) => {
				return ctx.injector.get(PpsHeaderDataService);
			},
			endPoint: 'listbyppsheader',
			mainItemColumn: 'Id',
			ppsItemColumn: 'NotExistingColumnName', //no ppsitem
			ppsHeaderColumn: 'Id',
		}, ctx);
	},
});

