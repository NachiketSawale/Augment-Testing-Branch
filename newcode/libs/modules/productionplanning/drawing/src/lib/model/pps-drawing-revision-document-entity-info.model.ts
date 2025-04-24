/*
 * Copyright(c) RIB Software GmbH
 */
// Need to change DrawingRevisionDataService's superclass from DataServiceFlatLeaf to DataServiceNodeLeaf at first!!!!!!!!!!!!!!!
// Then restore the following code.
/*
import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import { IEngDrwRevisionEntity } from './entities/eng-drw-revision-entity.interface';
import { DrawingRevisionDataService } from '../services/drawing-revision-data.service';

export const PPS_DRAWING_REVISION_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IEngDrwRevisionEntity>({
	containerUuid: 'cefbaf15b11042a18e0fa217ffa9782a',
	permissionUuid: '231c11dda4004fed84984b86488089be',
	gridTitle: { key: 'productionplanning.drawing.drwRevision.ppsDocumentListTitle', text: '*Drawing Revision: Documents' },
	foreignKey: 'EngDrwRevisionFk',
	// moduleName: 'productionplanning.drawing.revision.document',
	instantPreview: true,
	isReadonly: true,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(DrawingRevisionDataService);
	},

});
*/