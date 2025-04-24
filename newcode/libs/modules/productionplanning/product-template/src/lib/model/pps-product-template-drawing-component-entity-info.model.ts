/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
	PpsProductTemplateDrawingComponentDataService
} from '../services/pps-product-template-drawing-component-data.service';
import { EngDrawingComponentSharedLayout, IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';
import { runInInjectionContext } from '@angular/core';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';


export const PPS_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingComponentEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.producttemplate.drawingComponentListTitle' },
		containerUuid: 'da1dcc5610e64e219807d694b1b3af8d',
	},
	form: {
		title: { key: 'productionplanning.producttemplate.drawingComponentDetailTitle' },
		containerUuid: 'da2b35c28cb34dc8bd3c36cea7a2cac3',
	},
	dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
		return PpsProductTemplateDrawingComponentDataService.getInstance('da1dcc5610e64e219807d694b1b3af8d', ctx.injector.get(PpsProductTemplateDataService));
	}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingComponentDto' },
	permissionUuid: '3f27b4813a144aee9aaac9f8cd8651c6',
	layoutConfiguration: EngDrawingComponentSharedLayout
});