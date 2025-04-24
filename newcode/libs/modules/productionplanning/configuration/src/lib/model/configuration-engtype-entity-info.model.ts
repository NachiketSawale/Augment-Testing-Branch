/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationEngtypeDataService } from '../services/configuration-engtype-data.service';
import { ConfigurationEngtypeBehavior } from '../behaviors/configuration-engtype-behavior.service';
import { IEngTypeEntity } from './entities/eng-type-entity.interface';
import { createLookup, FieldType, imageSelectData } from '@libs/ui/common';
import { BasicsSharedRubricCategoryByRubricAndCompanyLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const CONFIGURATION_ENGTYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngTypeEntity>({
	grid: {
		title: { key: 'productionplanning.configuration' + '.engtypeListTitle' },
		behavior: (ctx) => ctx.injector.get(ConfigurationEngtypeBehavior),
	},
	form: {
		title: { key: 'productionplanning.configuration' + '.engtypeDetailTitle' },
		containerUuid: 'c9cb4cbaf3c44b6c98f01e943dd6d5d7',
	},
	dataService: (ctx) => ctx.injector.get(ConfigurationEngtypeDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'EngTypeDto' },
	permissionUuid: '40ad0cb374dd490f8abbceeccc89ac06',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['DescriptionInfo', 'Icon', 'IsDefault', 'IsLive', 'RubricCategoryFk', 'Sorting'],
			},
		],
		overloads: {
			RubricCategoryFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
					serverSideFilter: {
						key: 'rubric-category-by-rubric-company-lookup-filter',
						execute() {
							return { Rubric: 77 }; //77 is rubric for Engineering.
						},
					},
				}),
			},
			Icon: {
				type: FieldType.ImageSelect,
				itemsSource: {
					items: imageSelectData,
				},
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				Icon: { key: 'entityIcon', text: 'Icon' },
				IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
				IsLive: { key: 'entityIsLive', text: 'Active' },
				Sorting: { key: 'entitySorting', text: 'Sorting' },
			}),
			RubricCategoryFk: { key: 'basics.company.entityBasRubricCategoryFk', text: 'Category' },
		},
	},
});
