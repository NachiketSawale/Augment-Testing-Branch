/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { PpsProjectLocationFilterService } from '../services/project-location-filter/pps-project-location-filter.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PPS_PROJECT_LOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectLocationEntity>({
	grid: {
		title: { key: 'productionplanning.drawing.projectlocation.list' },
		//behavior: (ctx) => ctx.injector.get(PpsProjectLocationFilterService),
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(PpsProjectLocationFilterService);
					return service.parentOf(entity);
				},
				children: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(PpsProjectLocationFilterService);
					return service.childrenOf(entity);
				},
			};
		},
	},
	dtoSchemeId: {
		moduleSubModule: 'Project.Location',
		typeName: 'LocationDto',
	},
	permissionUuid: '231c11dda4004fed84984b86488089be',
	dataService: (ctx) => ctx.injector.get(PpsProjectLocationFilterService),
	layoutConfiguration: (context) => {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						text: 'Locations',
						key: 'qto.main.locations.title',
					},
					attributes: ['Code', 'DescriptionInfo', 'Quantity', 'QuantityPercent', 'Sorting'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('qto.main.', {
					Quantity: { key: 'Quantity' },
					Structure: { key: 'structure' },
					Sorting: { key: 'sorting' },
					UoMFk: { key: 'uoMFk' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescription' },
				}),
			},
			overloads: {},
		};
	},
});
