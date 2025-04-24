/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { PpsNestingDataService } from '../services/pps-nesting-data.service';
import { IPpsFabricationUnitEntity, IPpsNestingEntity } from './models';

import {
	IPpsFabricationUnitLookupEntity,
	ProductionplanningSharedFabricationunitLookupService
} from '@libs/productionplanning/shared';


export const PPS_NESTING_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsNestingEntity>({
	grid: {
		title: { key: 'productionplanning.fabricationunit.nesting.listTitle' },
		containerUuid: '8f26cd9926514b0f9293ed8a98fcee30',
	},
	dataService: ctx => ctx.injector.get(PpsNestingDataService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.Fabricationunit', typeName: 'PpsNestingDto' },
	permissionUuid: 'bca1c47dfd91434b8eaab67d4bb961bd',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['PpsItemFk', 'EngDrawingFk', 'PpsProductFk', 'PpsFabricationUnitFk',
					'PositionX', 'PositionY', 'PositionZ', 'AngleA', 'AngleB', 'AngleC', 'SlabNumber',
					'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
			}],
		overloads: {
			PpsProductFk: {},
			EngDrawingFk: {},
			PpsItemFk: {},
			PpsFabricationUnitFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IPpsFabricationUnitEntity, IPpsFabricationUnitLookupEntity>({
					dataServiceToken: ProductionplanningSharedFabricationunitLookupService,
					descriptionMember: 'Code'
				})
			},
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '1' }
				},
				type: FieldType.Description
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '2' }
				},
				type: FieldType.Description
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '3' }
				},
				type: FieldType.Description
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '4' }
				},
				type: FieldType.Description
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined',
					params: { 'p_0': '5' }
				},
				type: FieldType.Description
			},
		},
		labels: {
			...prefixAllTranslationKeys('productionplanning.common.', {
				PpsProductFk: { key: 'event.productFk', text: '*PPS Product' },
				PpsItemFk: { key: 'event.itemFk', text: '*Production Unit' },
				EngDrawingFk: { key: 'event.drawing', text: '*Drawing' },
			}),
			...prefixAllTranslationKeys('productionplanning.product.', {
				PositionX: { key: 'productionPlace.positionX', text: '*PositionX' },
				PositionY: { key: 'productionPlace.positionY', text: '*PositionY' },
				PositionZ: { key: 'productionPlace.positionZ', text: '*PositionZ' },
			}),
			...prefixAllTranslationKeys('productionplanning.fabricationunit.', {
				AngleA: { key: 'nesting.angleA', text: '*AngleA' },
				AngleB: { key: 'nesting.angleB', text: '*AngleB' },
				AngleC: { key: 'nesting.angleC', text: '*AngleC' },
				SlabNumber: { key: 'nesting.slabNumber', text: '*AngleC' },
			}),
		}
	},
});