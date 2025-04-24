/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialMaterialGroupDataService } from './basics-material-material-group-data.service';
import { IMaterialGroupEntity } from '@libs/basics/shared';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsMaterialMaterialGroupBehavior } from './basics-material-material-group-behavior.service';
import { BasicsMaterialFilterLayoutExtendHelper } from '../service/basics-material-filter-layout-extend.service';
import { BasicsMaterialMaterialGroupValidationService } from './basics-material-material-group-validation.service';

export const BASICS_MATERIAL_MATERIAL_GROUP_ENTITY_INFO = EntityInfo.create<IMaterialGroupEntity>({
	grid: {
		title: { text: 'Material Group Filter', key: 'basics.material.record.groupTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsMaterialMaterialGroupBehavior),
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IMaterialGroupEntity) {
					const service = ctx.injector.get(BasicsMaterialMaterialGroupDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IMaterialGroupEntity) {
					const service = ctx.injector.get(BasicsMaterialMaterialGroupDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IMaterialGroupEntity>;
		},
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialMaterialGroupDataService),
	permissionUuid: '29bcf2f0bd994b0d9cdb941c2f4fbfcd',
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialGroupDto' },
	validationService: (ctx) => ctx.injector.get(BasicsMaterialMaterialGroupValidationService),
	layoutConfiguration: (context) => {
		return import('@libs/basics/materialcatalog').then((module) => {
			return new BasicsMaterialFilterLayoutExtendHelper<IMaterialGroupEntity>().ExtendLayout(context.injector.get(module.BasicsMaterialGroupLayoutService).generateLayout());
		});
	},
});
