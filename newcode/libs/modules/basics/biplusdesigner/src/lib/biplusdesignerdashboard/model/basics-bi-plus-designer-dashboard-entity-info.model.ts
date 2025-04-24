/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsBiPlusDesignerDashboardDataService } from '../services/basics-bi-plus-designer-dashboard-data.service';
import { BasicsBiPlusDesignerDashboardBehavior } from '../behaviors/basics-bi-plus-designer-dashboard-behavior.service';
import { IDashboardEntity } from './entities/dashboard-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicBiPlusDesignerDashboardTypeFormLookupService } from '../services/basics-bi-plus-designer-dashboard-type-form-lookup.service';
import { BasicBiPlusDesignerDashboardTypeGridLookupService } from '../services/basics-bi-plus-designer-dashboard-type-grid-lookup.service';

export const BASICS_BI_PLUS_DESIGNER_DASHBOARD_ENTITY_INFO: EntityInfo = EntityInfo.create<IDashboardEntity>({
	grid: {
		title: { key: 'basics.biplusdesigner.dashboardContainerTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsBiPlusDesignerDashboardBehavior),
	},
	form: {
		title: { key: 'basics.biplusdesigner.dashboardDetailsContainerTitle' },
		containerUuid: '73cc6ab1dc674c8089578abdccdd89b5',
	},
	dataService: (ctx) => ctx.injector.get(BasicsBiPlusDesignerDashboardDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.BiPlusDesigner', typeName: 'DashboardDto' },
	permissionUuid: '2ec68681903544bfbe5f159382a61d70',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['NameInfo', 'ExternalName', 'DescriptionInfo', 'ExternalId', 'BasDashboardTypeFk', 'Sorting', 'IsVisible', 'HasTranslation'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.biplusdesigner.', {
				Id: {
					text: 'Id',
				},
				Description: {
					text: 'Description',
					key: 'description',
				},
				Sorting: {
					text: 'Sorting',
					key: 'Sorting',
				},
				ExternalName: {
					text: 'External Name',
					key: 'entityExternalName',
				},
				ExternalId: {
					key: 'External Id',
					text: 'entityExternalId',
				},
				BasDashboardTypeFk: {
					key: 'entityBasDashboardTypeFk',
					text: 'Dashboard Type',
				},
				NameInfo: {
					key: 'entityName',
					text: 'Name',
				},
				IsVisible: {
					key: 'entityIsVisible',
					text: 'Is Visible',
				},
				IsActive: {
					key: 'entityIsActive',
					text: 'Is Active',
				},
				IsAvailable: {
					key: 'entityIsAvailable',
					text: 'Is Available',
				},
				HasTranslation: {
					key: 'entityHasTranslation',
					text: 'Has Translation',
				},
			}),
		},
		overloads: {
			Id: { readonly: true },
			NameInfo: {
				grid: {
					readonly: true,
				},
				form: {
					readonly: true,
				},
			},
			DescriptionInfo: {
				grid: {
					readonly: true,
				},
				form: {
					readonly: true,
				},
			},
			ExternalName: {
				grid: {
					readonly: true,
				},
				form: {
					readonly: true,
				},
			},

			ExternalId: {
				grid: {
					readonly: true,
				},
				form: {
					readonly: true,
				},
			},
			BasDashboardTypeFk: {
				form: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicBiPlusDesignerDashboardTypeFormLookupService,
					}),
				},
				grid: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicBiPlusDesignerDashboardTypeGridLookupService,
					}),
				},
			},
			HasTranslation: {
				grid: {
					readonly: true,
				},
				form: {
					readonly: true,
				},
			},
		},
	},
});
