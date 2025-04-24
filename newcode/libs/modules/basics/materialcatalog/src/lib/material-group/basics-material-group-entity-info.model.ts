/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IMaterialGroupEntity } from '@libs/basics/shared';

import { BasicsMaterialGroupBehavior } from './basics-material-group-behavior.service';
import { BasicsMaterialGroupDataService } from './basics-material-group-data.service';
import { BasicsMaterialGroupLayoutService } from './basics-material-group-layout.service';
import { BasicsMaterialGroupValidationService } from './basics-material-group-validation.service';

export const BASICS_MATERIAL_GROUP_ENTITY_INFO = EntityInfo.create<IMaterialGroupEntity>({
	grid: {
		title: { text: 'Material Groups', key: 'basics.materialcatalog.HeadTitle.group' },
		behavior: (ctx) => ctx.injector.get(BasicsMaterialGroupBehavior),
		treeConfiguration: true,
	},
	form: {
		containerUuid: 'aa40536df33e41659960eee10756f8bb',
		title: { text: 'Material Group Detail', key: 'basics.materialcatalog.HeadTitle.groupDetail' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialGroupDataService),
	validationService: (context) => context.injector.get(BasicsMaterialGroupValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialGroupDto' },
	permissionUuid: '23485e272689454c91c109beca46972e',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialGroupLayoutService).generateLayout();
	},
});
