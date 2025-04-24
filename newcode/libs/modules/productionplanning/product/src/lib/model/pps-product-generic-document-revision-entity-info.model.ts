/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPpsGenericDocumentEntity, ProductionplanningSharedGenericDocumentDataServiceManager, ProductionplanningSharedGenericDocumentRevisionEntityInfoFactory } from '@libs/productionplanning/shared';
import { IInitializationContext } from '@libs/platform/common';
import { PpsProductDataService } from '../services/pps-product-data.service';

export const PPS_PRODUCT_GENERIC_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningSharedGenericDocumentRevisionEntityInfoFactory.create<IPpsGenericDocumentEntity>({
	containerUuid: 'ef3e10364d78449d939ce179f158b539',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.drawing.productDescription.document.revision.listTitle', text: '*Product Template Document: Revisions' },
	apiUrl: 'productionplanning/common/product/documentrevision',
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '1caadf054a164ef3be9aa5b1ef62d776',
			apiUrl: 'productionplanning/common/product/document',
			parentFilter: 'productFk',
			uploadServiceKey: 'pps-product',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsProductDataService)
		};
		return ProductionplanningSharedGenericDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});

