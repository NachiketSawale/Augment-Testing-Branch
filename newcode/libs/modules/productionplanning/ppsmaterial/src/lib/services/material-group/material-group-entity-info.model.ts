/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialGroupEntity } from '@libs/basics/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { PpsMaterialFilterLayoutExtendHelper } from '../material-catalog/material-filter-layout-extend.service';
import { PpsMaterialGroupBehavior } from './material-group-behavior.service';
import { PpsMaterialGroupDataService } from './material-group-data.service';
import { PpsMaterialGroupValidationService } from './material-group-validation.service';

export const PPS_MATERIAL_GROUP_ENTITY_INFO = EntityInfo.create<IMaterialGroupEntity>({
	grid: {
		title: { text: 'Material Group Filter', key: 'basics.material.record.groupTitle' },
		behavior: (ctx) => ctx.injector.get(PpsMaterialGroupBehavior),
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IMaterialGroupEntity) {
					const service = ctx.injector.get(PpsMaterialGroupDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IMaterialGroupEntity) {
					const service = ctx.injector.get(PpsMaterialGroupDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IMaterialGroupEntity>;
		},
	},
	dataService: (ctx) => ctx.injector.get(PpsMaterialGroupDataService),
	permissionUuid: 'bb5a7bda5ffa4ce7ac27655af85b66f4',
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialGroupDto' },
	validationService: (ctx) => ctx.injector.get(PpsMaterialGroupValidationService),
	layoutConfiguration: (context) => {
		return import('@libs/basics/materialcatalog').then((module) => {
			return new PpsMaterialFilterLayoutExtendHelper<IMaterialGroupEntity>().ExtendLayout(context.injector.get(module.BasicsMaterialGroupLayoutService).generateLayout());
		});
	},
});
