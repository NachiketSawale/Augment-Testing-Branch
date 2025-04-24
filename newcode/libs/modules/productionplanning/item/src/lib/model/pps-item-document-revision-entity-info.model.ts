/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningShareDocumentRevisionEntityInfoFactory, ProductionplanningSharedDocumentDataServiceManager } from '@libs/productionplanning/shared';
import { PpsItemDataService } from '../services/pps-item-data.service';

export const PPS_ITEM_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: '013dc1e2cd8e46d7b8dfa5e9d71ab36b',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.item.document.revision.gridTitle', text: '*Production Unit Document: Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '94875edb5ed146399bb26b2c7353f789',
			foreignKey: 'PpsItemFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(PpsItemDataService)
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});
