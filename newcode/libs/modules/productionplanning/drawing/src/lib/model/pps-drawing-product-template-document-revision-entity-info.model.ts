/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningShareDocumentRevisionEntityInfoFactory, ProductionplanningSharedDocumentDataServiceManager } from '@libs/productionplanning/shared';
import { DrawingDataService } from '../services/drawing-data.service';

export const PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: 'ef3e10364d78449d939ce179f158b539',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.drawing.productDescription.document.revision.listTitle', text: '*Product Template Document: Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '57yu4t083b637bf4hmb9bff0dtdf69ec',
			foreignKey: 'ProductDescriptionFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(DrawingDataService)
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});
