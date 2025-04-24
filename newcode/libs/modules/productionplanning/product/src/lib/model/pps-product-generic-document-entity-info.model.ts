/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareGenericDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsProductDataService } from '../services/pps-product-data.service';
import { IPpsProductEntity } from './models';

export const PPS_PRODUCT_GENERIC_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareGenericDocumentEntityInfoFactory.create<IPpsProductEntity>({
	containerUuid: '1caadf054a164ef3be9aa5b1ef62d776',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.producttemplate.documentListTitle', text: '*Documents' },
	apiUrl: 'productionplanning/common/product/document',
	parentFilter: 'productFk',
	uploadServiceKey: 'pps-product',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductDataService);
	},
});
