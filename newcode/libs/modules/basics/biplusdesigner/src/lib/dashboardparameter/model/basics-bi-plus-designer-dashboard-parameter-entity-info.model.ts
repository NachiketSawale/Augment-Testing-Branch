/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { BasicsBiPlusDesignerSysContextLookupService } from '../services/basics-biplusdesigner-syscontext-lookup-data.service';
import { BasicsBiPlusDesignerDashboardParameterDataService } from '../services/basics-bi-plus-designer-dashboard-parameter-data.service';
import { IDashboardParameterEntity } from '../../biplusdesignerdashboard/model/entities/dashboard-parameter-entity.interface';

export const BASICS_BI_PLUS_DESIGNER_DASHBOARD_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<IDashboardParameterEntity>({
	grid: {
		title: { key: 'basics.biplusdesigner.dashboard.parameterContainerTitle' },
	},
	form: {
		title: { key: 'basics.biplusdesigner.dashboard.parameterDetailsContainerTitle' },
		containerUuid: 'afec89cadec84869927ca3491058ff8c',
	},
	dataService: (ctx) => ctx.injector.get(BasicsBiPlusDesignerDashboardParameterDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.BiPlusDesigner', typeName: 'DashboardParameterDto' },
	permissionUuid: '562d8db017364b9e94bb2c4a96d49f2e',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['Description', 'Name', 'DataType', 'SysContext', 'Default', 'IsVisible', 'DataSource'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.biplusdesigner.', {
				Name: {
					key: 'entityName',
					text: 'Name',
				},
				Description: {
					text: 'Description',
					key: 'description',
				},
				BasDashboardFk: {
					key: 'entityBasDashboardFk',
					text: 'Dashboard',
				},
				SysContext: {
					key: 'entitySysContext',
					text: 'SysContext',
				},
				DataType: {
					key: 'entityDataType',
					text: 'Data Type',
				},
				IsVisible: {
					key: 'entityIsVisible',
					text: 'IsVisible',
				},

				DataSource: {
					key: 'entityDataSource',
					text: 'Data Source',
				},

				Default: {
					key: 'entityDefault',
					text: 'Default',
				},
			}),
		},
		overloads: {
			DataType: { readonly: true },
			IsVisible: { readonly: true },
			DataSource: { readonly: true },
			SysContext: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsBiPlusDesignerSysContextLookupService,
				}),
			},
		},
	},
});
