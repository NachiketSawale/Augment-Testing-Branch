/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { BasicsMaterialCatalogDiscountGroupDataService } from './basics-material-catalog-discount-group-data.service';
import { BasicsMaterialCatalogDiscountGroupLayoutService } from './basics-material-catalog-discount-group-layout.service';
import { BasicsMaterialCatalogDiscountGroupBehavior } from './basics-material-catalog-discount-group-behavior.service';
import { BasicsMaterialCatalogDiscountGroupValidationService } from './basics-material-catalog-discount-group-validation.service';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';

export const BASICS_MATERIAL_CATALOG_DISCOUNT_GROUP_ENTITY_INFO = EntityInfo.create<IMaterialDiscountGroupEntity>({
	grid: {
		title: { text: 'Discount Groups', key: 'basics.materialcatalog.HeadTitle.discountGroup' },
		behavior: (ctx) => ctx.injector.get(BasicsMaterialCatalogDiscountGroupBehavior),
		treeConfiguration: true,
	},
	form: {
		containerUuid: '79412e5126744a1b9f9e0a69abb2682d',
		title: { text: 'Discount Group Detail', key: 'basics.materialcatalog.HeadTitle.discountGroupDetail' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialCatalogDiscountGroupDataService),
	validationService: (context) => context.injector.get(BasicsMaterialCatalogDiscountGroupValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialDiscountGroupDto' },
	permissionUuid: 'b39602ec8d7b4a82a5f311bffc79d3ce',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialCatalogDiscountGroupLayoutService).generateLayout();
	},
});
