/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IPpsDocumentEntity, ProductionplanningShareDocumentRevisionEntityInfoFactory, ProductionplanningSharedDocumentDataServiceManager } from '@libs/productionplanning/shared';
import { DrawingDataService } from '../services/drawing-data.service';

export const PPS_DRAWING_DOCUMENT_REVISION_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentRevisionEntityInfoFactory.create<IPpsDocumentEntity>({
	containerUuid: 'ef3e00364d78449d939ce179f158b535',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.drawing.document.revision.listTitle', text: '*Drawing Document: Revisions' },
	parentServiceFn: (ctx) => {
		const parentOptions = {
			containerUuid: '56yh4c988b634bf4hfb9bff0d6dfb9ec',
			foreignKey: 'EngDrawingFk',
			parentServiceFn: (context: IInitializationContext) => context.injector.get(DrawingDataService)
		};
		return ProductionplanningSharedDocumentDataServiceManager.getDataService(parentOptions, ctx);
	},

});
