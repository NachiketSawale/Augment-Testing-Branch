/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsProductTemplateParameterDataService } from '../services/pps-product-template-parameter-data.service';
import { PpsProductTemplateParameterBehavior } from '../behaviors/pps-product-template-parameter-behavior.service';
import { IPpsParameterEntity } from './models';
import { PpsParameterSharedLayout } from '@libs/productionplanning/shared';
import { PpsProductTemplateParamValidationService } from '../services/pps-product-template-param-validation.service';


export const PPS_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsParameterEntity>({
	grid: {
		title: { key: 'productionplanning.producttemplate.productDescParamListTitle' },
		containerUuid: '9acde5c951e74427a5beb198bf1da063',
		behavior: ctx => ctx.injector.get(PpsProductTemplateParameterBehavior),
	},
	validationService: ctx => ctx.injector.get(PpsProductTemplateParamValidationService),
	dataService: ctx => ctx.injector.get(PpsProductTemplateParameterDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsParameterDto' },
	permissionUuid: '6d8ad94435f1431f912817677b31d475',
	layoutConfiguration: PpsParameterSharedLayout
});