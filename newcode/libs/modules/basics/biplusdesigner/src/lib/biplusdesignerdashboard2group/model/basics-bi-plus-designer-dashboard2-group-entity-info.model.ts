/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, createLookup } from '@libs/ui/common';
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDashboard2GroupEntity } from './entities/dashboard-2group-entity.interface';
import { BasicsBiPlusDesignerDashboard2GroupDataService } from '../services/basics-bi-plus-designer-dashboard2-group-data.service';
import { BasicsBiPlusDesignerDashboard2GroupBehavior } from '../behaviors/basics-bi-plus-designer-dashboard2-group-behavior.service';
import { BasicsBiPlusDesignerDashboard2GroupFormBehavior } from '../behaviors/basics-bi-plus-designer-dashboard2-group-form-behavior.service';
import { BasicBiPlusDesignerDashboardGroupNameLookupService } from '../services/basics-bi-plus-designer-dashboard-group-name-lookup.service';
import { visibilityItems } from './visibility-items-data';

/**
 * The Basicsbiplusdesigner Dashboard to Group container configuration
 */
export const BASICS_BI_PLUS_DESIGNER_DASHBOARD2_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IDashboard2GroupEntity> ({
    grid: {
        title: {key: 'basics.biplusdesigner.dashboard2GroupContainerTitle'},
        behavior: ctx => ctx.injector.get(BasicsBiPlusDesignerDashboard2GroupBehavior),
    },
    form: {
        title: { key: 'basics.biplusdesigner.dashboard2GroupDetailsContainerTitle' },
		behavior: ctx => ctx.injector.get(BasicsBiPlusDesignerDashboard2GroupFormBehavior),
        containerUuid: 'e52463c9c6844e94a642457cf4c84bb4',
    },
    dataService: ctx => ctx.injector.get(BasicsBiPlusDesignerDashboard2GroupDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.BiPlusDesigner', typeName: 'Dashboard2GroupDto'},
    permissionUuid: '0bd93cbf33c248d481f96cde91861050',
    layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['BasDashboardGroupFk','DescriptionInfo', 'Sorting', 'IsVisible', 'Visibility','FrmAccessRightDescriptorFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.biplusdesigner.', {
                BasDashboardGroupFk:{
                    key: 'DashboardGroupFk',
					text: 'BasDashboardGroupFk',
                },
				IsVisible: {
					key: 'entityIsVisible',
					text: 'IsVisible',
				},
				Visibility: {
					key: 'entityVisibility',
					text: 'Visibility',
				},
			}),
			...prefixAllTranslationKeys('basics.config.', {
				DescriptionInfo: {
                    key: 'entityDescription',
					text: 'description',
				},
				Sorting: {
                    key: 'tabSorting',
					text: 'Sorting',
				},
				FrmAccessRightDescriptorFk: {
					key: 'frmAccessrightdescriptorFk',
					text: 'FrmAccessRightDescriptorFk',
				},
			}),
		},
		overloads: {
			BasDashboardGroupFk: {
				form: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicBiPlusDesignerDashboardGroupNameLookupService,
					}),
				},
				grid: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicBiPlusDesignerDashboardGroupNameLookupService,
					}),
                    width:200
				},	
			},
			Visibility: {
				grid: {
					type: FieldType.Select,
					itemsSource: {
						items: visibilityItems
					},
					sortable: true,
				},
				form: {
					type: FieldType.Select,
					itemsSource: {
						items: visibilityItems
					}
				},
			},
			FrmAccessRightDescriptorFk: {
				grid:{
					//TODO: fieldtype action not yet implemented
				},
				form: {
					readonly: true
				}
			}
		},
	},
        
});