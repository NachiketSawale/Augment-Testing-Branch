/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';
import { IPpsProductTemplateEntity } from './models';

export const PPS_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IPpsProductTemplateEntity>({
	containerUuid: 'acc99d47ea464caea158de6ee69762b1',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.producttemplate.documentListTitle', text: '*Documents' },
	foreignKey: 'ProductDescriptionFk',
	// moduleName: 'productionplanning.producttemplate.document.list',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsProductTemplateDataService);
	},

});
