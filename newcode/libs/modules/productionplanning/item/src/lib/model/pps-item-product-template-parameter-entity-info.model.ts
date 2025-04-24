/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
	IPpsParameterEntityGenerated,
	PpsParameterSharedLayout,
} from '@libs/productionplanning/shared';
import {
	PpsItemProductTemplateParameterDataService
} from '../services/product-template/pps-item-product-template-parameter-data.service';
import { PpsItemProductTemplateParameterBehavior } from '../behaviors/pps-item-product-template-behavior.service';
import {
	PpsItemProductTemplateParamValidationService
} from '../services/product-template/pps-item-product-template-parameter-validation.service';


export const PPS_ITEM_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsParameterEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.producttemplate.productDescParamListTitle' },
		containerUuid: '0bfc88832b19470199efdbb35f2eadf6',
		behavior: ctx => ctx.injector.get(PpsItemProductTemplateParameterBehavior),
	},
	validationService: ctx => ctx.injector.get(PpsItemProductTemplateParamValidationService),
	dataService: ctx => ctx.injector.get(PpsItemProductTemplateParameterDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsParameterDto' },
	permissionUuid: '0552ba86fc1e4d559ef93c2a10e0696b',
	layoutConfiguration: PpsParameterSharedLayout
});