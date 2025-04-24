

/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EngDrawingComponentSharedLayout, IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';
import { runInInjectionContext } from '@angular/core';
import { PpsItemDataService } from '../services/pps-item-data.service';
import {
	PpsItemProductTemplateComponentDataService
} from '../services/product-template/pps-item-product-template-component-data.service';
import {
	PpsItemProductTemplateComponentBehavior
} from '../behaviors/pps-item-product-template-component-behavior.service';
import {
	PpsItemProductTemplateComponentValidationService
} from '../services/product-template/pps-item-product-template-component-validation.service';


export const PPS_ITEM_PRODUCT_TEMPLATE_COMPONENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingComponentEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.producttemplate.drawingComponentListTitle' },
		containerUuid: 'a6293dfb6d944ae3a2c5a7ff3c55ed07',
		behavior: ctx => ctx.injector.get(PpsItemProductTemplateComponentBehavior),
	},
	validationService: ctx => ctx.injector.get(PpsItemProductTemplateComponentValidationService),
	dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
		return PpsItemProductTemplateComponentDataService.getInstance('a6293dfb6d944ae3a2c5a7ff3c55ed07', ctx.injector.get(PpsItemDataService))!;
	}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingComponentDto' },
	permissionUuid: '3f27b4813a144aee9aaac9f8cd8651c6',
	layoutConfiguration: EngDrawingComponentSharedLayout
});