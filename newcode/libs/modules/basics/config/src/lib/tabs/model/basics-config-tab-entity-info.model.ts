/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { IModuleTabEntity } from './entities/module-tab-entity.interface';
import { BasicsConfigTabBehavior } from '../behaviors/basics-config-tab-behavior.service';
import { BasicsConfigTabDataService } from '../services/basics-config-tab-data.service';

export const BASICS_CONFIG_TAB_ENTITY_INFO: EntityInfo = EntityInfo.create<IModuleTabEntity>({
	grid: {
		title: { key: 'basics.config.tabsContainerTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsConfigTabBehavior),
	},

	dataService: (ctx) => ctx.injector.get(BasicsConfigTabDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'ModuleTabDto' },
	permissionUuid: 'ece7368917db45a3865fe3b2fafbb3ec',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['DescriptionInfo', 'Sorting', 'IsVisible', 'Visibility', 'AccessRightDescriptorFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.config.', {
				DescriptionInfo: {
					key: 'description',
				},
				Sorting: {
					key: 'tabSorting',
				},
				IsVisible: {
					key: 'isvisible',
				},
				Visibility: {
					key: 'barvisibility',
				},
				AccessRightDescriptorFk: {
					key: 'descriptor',
				},
			}),
		},
		overloads: {
			AccessRightDescriptorFk: {
				readonly: true,
			},
			Visibility: {
				grid: {
					type: FieldType.Select,
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: {
									text: '',
									key: 'basics.config.visibilityProperty.standardOnly',
								},
							},
							{
								id: 2,
								displayName: {
									text: '',
									key: 'basics.config.visibilityProperty.portalOnly',
								},
							},
							{
								id: 3,
								displayName: {
									text: '',
									key: 'basics.config.visibilityProperty.standardPortal',
								},
							},
						],
					},
					sortable: true,
				},
			},
		},
	},
});
