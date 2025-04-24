/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { DrawingDataService } from '../services/drawing-data.service';
import { IEngDrawingEntity } from './entities/eng-drawing-entity.interface';
// import { EngDrawingComplete } from './eng-drawing-complete.class';

export const PPS_DRAWING_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IEngDrawingEntity/*, EngDrawingComplete */>({
	containerUuid: '56yh4c988b634bf4hfb9bff0d6dfb9ec',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.drawing.document.listTitle', text: '*Drawing: Documents' },
	foreignKey: 'EngDrawingFk',
	// moduleName: 'productionplanning.drawing.ppsdocument',
	instantPreview: true,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(DrawingDataService);
	},

});
