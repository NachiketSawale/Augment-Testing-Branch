/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';
import { IPpsProductTemplateEntity } from './models';
import { PpsProductTemplateLayout } from './entity-info-layout/pps-product-template-layout';
import { PpsProductTemplateValidationService } from '../services/pps-product-template-validation-.service';


export const PPS_PRODUCT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductTemplateEntity>({
	grid: {
		title: { key: 'productionplanning.producttemplate.productDescriptionListTitle' },
		containerUuid: 'ff4c323cfd0e4a5692f923110b8ffb00',
	},
	form: {
		title: { key: 'productionplanning.producttemplate.productDescriptionDetailTitle' },
		containerUuid: '32b419bf9fcc4069910e4b9396239780',
	},
	dataService: ctx => ctx.injector.get(PpsProductTemplateDataService),
	validationService: ctx => ctx.injector.get(PpsProductTemplateValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.ProductTemplate', typeName: 'ProductDescriptionDto' },
	permissionUuid: '4b3bf707e6ee44748685a142a57168b4',
	layoutConfiguration: PpsProductTemplateLayout
});