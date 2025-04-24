/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsProductionSubsetBehavior } from '../behaviors/pps-production-subset-behavior.service';
import { PpsProductionSubsetDataService } from '../services/pps-production-subset-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPpsProductionSubsetEntity } from './entities/external_entities/pps-production-subset-entity.interface';
import { FieldType, createLookup } from '@libs/ui/common';
import { ProductionplanningSharedFabricationunitLookupService } from '@libs/productionplanning/shared';

export const PPS_PRODUCTION_SUBSET_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductionSubsetEntity>({
	grid: {
		title: { key: 'productionplanning.productionset' + '.subset.listTitle' },
		behavior: ctx => ctx.injector.get(PpsProductionSubsetBehavior),
		containerUuid: '2acd719749264074a62fcd2c4a94482e',
	},

	dataService: (ctx) => ctx.injector.get(PpsProductionSubsetDataService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.Fabricationunit', typeName: 'PpsProductionSubsetDto' },
	permissionUuid: '2581963f63944bdca59bec07f539cafb',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['PpsFabricationUnitFk'],
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
			},
			{
				gid: 'entityHistory',
				attributes: [''],
				// isHistory: true
			},
		],

		overloads: {
			PpsFabricationUnitFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProductionplanningSharedFabricationunitLookupService,
					displayMember: 'Code',
				}),
			},
			UserDefined1: {
				label: {
					text: '*User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '1' },
				},
				type: FieldType.Description,
			},
			UserDefined2: {
				label: {
					text: '*User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '2' },
				},
				type: FieldType.Description,
			},
			UserDefined3: {
				label: {
					text: '*User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '3' },
				},
				type: FieldType.Description,
			},
			UserDefined4: {
				label: {
					text: '*User-Defined 4',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '4' },
				},
				type: FieldType.Description,
			},
			UserDefined5: {
				label: {
					text: '*User-Defined 5',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '5' },
				},
				type: FieldType.Description,
			},
		},
		labels: {
			...prefixAllTranslationKeys('productionplanning.fabricationunit.', {
				PpsFabricationUnitFk: { key: 'fabricationUnit', text: '*Fabrication Unit' },
			}),
		},
	},
});
