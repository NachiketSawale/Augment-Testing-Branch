/*
 * Copyright(c) RIB Software GmbH
 */
import { runInInjectionContext } from '@angular/core';
import { EntityInfo } from '@libs/ui/business-base';
import { IPpsProductTemplateEntityGenerated, ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { EngineeringProductTemplateDataService } from '../services/engineering-product-template-data.service';
export const ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IPpsProductTemplateEntityGenerated>({
	containerUuid: 'd5a5827ede5241d5ab21e5f3d9429829',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.engineering.productDescriptionDocumentListTitle', text: '*Product Template Document: Revisions' },
	foreignKey: 'ProductDescriptionFk',
	instantPreview: true,
	parentServiceFn: (ctx) => {
		return runInInjectionContext(ctx.injector, () => {
			return ctx.injector.get(EngineeringProductTemplateDataService);
		});
	},
});