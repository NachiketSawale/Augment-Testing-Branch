/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningShareDocumentRevisionEntityInfoFactory, ProductionplanningSharedDocumentDataServiceManager } from '@libs/productionplanning/shared';
import { EngineeringProductTemplateDataService } from '../services/engineering-product-template-data.service';

export const ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: 'af8a5a1df29f42a6b86d1f990bada53a',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.engineering.productDescriptionDocumentRevisionListTitle', text: '*Product Template Document: Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: 'd5a5827ede5241d5ab21e5f3d9429829',
			foreignKey: 'ProductDescriptionFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(EngineeringProductTemplateDataService)
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});
