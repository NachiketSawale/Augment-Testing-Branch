/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPpsProductTemplateEntityGenerated, PpsProductTemplateSharedLayout } from '@libs/productionplanning/shared';
import { EngineeringProductTemplateDataService } from '../services/engineering-product-template-data.service';
import { EngineeringProductTemplateBehaviorService } from '../behaviors/engineering-product-template-behavior.service';

export const ENGINEERING_TASK_PRODUCT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductTemplateEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.engineering.productdescriptionListTitle' },
		containerUuid: 'c14c16d0cab949eb96f10ab05bc2ccfe',
		behavior: (ctx) => ctx.injector.get(EngineeringProductTemplateBehaviorService),
	},
	dataService: (ctx) => ctx.injector.get(EngineeringProductTemplateDataService),
	//Readonly container
	//validationService: (ctx) => ctx.injector.get(PpsProductTemplateValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductTemplate', typeName: 'ProductDescriptionDto' },
	permissionUuid: '4b3bf707e6ee44748685a142a57168b4',
	layoutConfiguration: PpsProductTemplateSharedLayout,
});
