/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsMaterialCatalogBehavior } from './material-catalog-behavior.service';
import { PpsMaterialCatalogDataService } from './material-catalog-data.service';
import { PpsMaterialCatalogValidationService } from './material-catalog-validation.service';
import { PpsMaterialFilterLayoutExtendHelper } from './material-filter-layout-extend.service';

export const PPS_MATERIAL_CATALOG_ENTITY_INFO = EntityInfo.create<IMaterialCatalogEntity>({
	grid: {
		title: { text: 'Material Catalog Filter', key: 'basics.material.record.catalogTitle' },
		behavior: (ctx) => ctx.injector.get(PpsMaterialCatalogBehavior),
	},
	dataService: (ctx) => ctx.injector.get(PpsMaterialCatalogDataService),
	permissionUuid: 'aa051ff3aecb4616824bd8ca6cfbbf4a',
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialCatalogDto' },
	validationService: (ctx) => ctx.injector.get(PpsMaterialCatalogValidationService),
	layoutConfiguration: (context) => {
		return import('@libs/basics/materialcatalog').then((module) => {
			return new PpsMaterialFilterLayoutExtendHelper<IMaterialCatalogEntity>().ExtendLayout(context.injector.get(module.BasicsMaterialCatalogLayoutService).generateLayout());
		});
	},
});
