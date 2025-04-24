/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { PpsProductRackAssignmentDataService } from '../services/pps-product-rack-assignment-data.service';
import { IPpsRackAssignEntity } from './entities/pps-rack-assign-entity.interface';

export const PPS_PRODUCT_RACK_ASSIGNMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsRackAssignEntity>({
	grid: {
		title: { key: 'productionplanning.product.rack.rackAssignListTitle' },
		containerUuid: '10a65fdf5dbf47988ccc2ad2ebea58a7',
	},

	dataService: ctx => ctx.injector.get(PpsProductRackAssignmentDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Product', typeName: 'PpsRackAssignDto' },
	permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['RackCode', 'ResResourceRackFk','CommentText']
			},
		],
		overloads: {
			ResResourceRackFk: {},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityComment', text: '*CommentText' }
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				RackCode: { key: 'rack.rackCode', text: '*Rack Code' },
				ResResourceRackFk: { key: 'rack.rack', text: '*Rack' }
			}),
		}
	}
});