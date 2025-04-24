/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
	PpsProductTemplateDrawingComponentDataService
} from '../services/drawing-product-template-component-data.service';
import { EngDrawingComponentSharedLayout, IEngDrawingComponentEntityGenerated } from '@libs/productionplanning/shared';
import { runInInjectionContext } from '@angular/core';
import { DrawingProductTemplateDataService } from '../services/drawing-product-template-data.service';
import { DrawingDataService } from '../services/drawing-data.service';


export const DRAWING_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingComponentEntityGenerated>({
	grid: {
		title: { key: 'productionplanning.producttemplate.drawingComponentListTitle' },
		containerUuid: '67340a9d7e8b4rg2d5gdfgn9d26ff856',
	},
	form: {
		title: { key: 'productionplanning.producttemplate.drawingComponentDetailTitle' },
		containerUuid: 'dfg40a9d7e8b8r5rf76dtd59y267uy56',
	},
	dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
		const productTemlateDateService = DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', ctx.injector.get(DrawingDataService));
		return PpsProductTemplateDrawingComponentDataService.getInstance('67340a9d7e8b4rg2d5gdfgn9d26ff856', productTemlateDateService);
	}),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingComponentDto' },
	permissionUuid: '3f27b4813a144aee9aaac9f8cd8651c6',
	layoutConfiguration: EngDrawingComponentSharedLayout
});