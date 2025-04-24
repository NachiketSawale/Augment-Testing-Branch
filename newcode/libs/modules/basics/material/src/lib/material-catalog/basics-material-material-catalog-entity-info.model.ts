/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialMaterialCatalogDataService } from './basics-material-material-catalog-data.service';
import { BasicsMaterialMaterialCatalogBehavior } from './basics-material-material-catalog-behavior.service';
import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { BasicsMaterialFilterLayoutExtendHelper } from '../service/basics-material-filter-layout-extend.service';
import { BasicsMaterialMaterialCatalogValidationService } from './basics-material-material-catalog-validation.service';

export const BASICS_MATERIAL_MATERIAL_CATALOG_ENTITY_INFO = EntityInfo.create<IMaterialCatalogEntity>({
	grid: {
		title: { text: 'Material Catalog Filter', key: 'basics.material.record.catalogTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsMaterialMaterialCatalogBehavior),
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialMaterialCatalogDataService),
	permissionUuid: 'de9355b7ded945918f287d76043602ff',
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialCatalogDto' },
	validationService: (ctx) => ctx.injector.get(BasicsMaterialMaterialCatalogValidationService),
	layoutConfiguration: (context) => {
		return import('@libs/basics/materialcatalog').then((module) => {
			return new BasicsMaterialFilterLayoutExtendHelper<IMaterialCatalogEntity>().ExtendLayout(context.injector.get(module.BasicsMaterialCatalogLayoutService).generateLayout());
		});
	},
});
