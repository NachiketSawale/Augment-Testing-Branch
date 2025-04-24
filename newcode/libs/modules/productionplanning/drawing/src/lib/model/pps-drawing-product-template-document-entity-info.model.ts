/*
 * Copyright(c) RIB Software GmbH
 */
import { runInInjectionContext } from '@angular/core';
import { EntityInfo } from '@libs/ui/business-base';
import { IPpsProductTemplateEntityGenerated, /*PpsProductTemplateComplete,*/ ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { DrawingDataService } from '../services/drawing-data.service';
import { DrawingProductTemplateDataService } from '../services/drawing-product-template-data.service';

export const PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IPpsProductTemplateEntityGenerated/*, PpsProductTemplateComplete */>({
	containerUuid: '57yu4t083b637bf4hmb9bff0dtdf69ec',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.drawing.productDescription.document.listTitle', text: '*Product Template: Documents' },
	foreignKey: 'ProductDescriptionFk',
	// moduleName: 'productionplanning.drawing.productdescription.ppsdocument',
	instantPreview: true,
	parentServiceFn: (ctx) => {
		return runInInjectionContext(ctx.injector, () => {
			return DrawingProductTemplateDataService.getInstance('6000ad4e0e934a23958349a0c3e24ba8', ctx.injector.get(DrawingDataService));
		});
	},

});
