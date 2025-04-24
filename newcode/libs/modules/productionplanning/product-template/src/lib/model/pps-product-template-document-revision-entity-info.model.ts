/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningShareDocumentRevisionEntityInfoFactory, ProductionplanningSharedDocumentDataServiceManager } from '@libs/productionplanning/shared';
import { PpsProductTemplateDataService } from '../services/pps-product-template-data.service';

export const PPS_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: 'be8ace818f204f8eb24c67d81f174bd1',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.producttemplate.documentRevisionListTitle', text: '*Document: Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: 'acc99d47ea464caea158de6ee69762b1',
			foreignKey: 'ProductDescriptionFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsProductTemplateDataService)
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});
