/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsMaterialToMdlProductTypeBehavior } from '../behaviors/pps-material-to-mdl-product-type-behavior.service';
import { PpsMaterialToMdlProductTypeDataService } from '../services/material-to-producttype/pps-material-to-mdl-product-type-data.service';
import { PpsMaterialToMdlProductTypeValidationService } from '../services/material-to-producttype/pps-material-to-mdl-product-type-validation.service';
import { IPpsMaterial2MdlProductTypeEntity } from './models';
import { PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_LAYOUT } from './pps-material-to-mdl-product-type-layout.model';

export const PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsMaterial2MdlProductTypeEntity>({
	grid: {
		title: { key: 'productionplanning.ppsmaterial.ppsMaterialToMdlProductType.listViewTitle' },
		behavior: ctx => ctx.injector.get(PpsMaterialToMdlProductTypeBehavior),
	},
	form: {
		title: { key: 'productionplanning.ppsmaterial.ppsMaterialToMdlProductType.detailViewTitle' },
		containerUuid: '6813f89fc9974d5daa7da9f1079c5dfc',
	},
	dataService: ctx => ctx.injector.get(PpsMaterialToMdlProductTypeDataService),
	validationService: ctx => ctx.injector.get(PpsMaterialToMdlProductTypeValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsMaterial', typeName: 'PpsMaterial2MdlProductTypeDto' },
	permissionUuid: 'dc136f0fea314fcda4517b27edbe0dee',
	layoutConfiguration: PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_LAYOUT,

});