/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProductionplanningShareDocumentEntityInfoFactory } from '@libs/productionplanning/shared';
import {PpsItemDataService} from '../services/pps-item-data.service';
import {IPPSItemEntity} from './entities/pps-item-entity.interface';
// import { PPSItemComplete } from './entities/pps-item-complete.class';

export const PPS_ITEM_DOCUMENT_ENTITY_INFO: EntityInfo = ProductionplanningShareDocumentEntityInfoFactory.create<IPPSItemEntity/*, PPSItemComplete */>({
	containerUuid: '94875edb5ed146399bb26b2c7353f789',
	permissionUuid: '5640a72648e24f21bf3985624c4d0fdf',
	gridTitle: { key: 'productionplanning.item.document.itemDocumentListTitle', text: '*Production Unit Documents' },
	foreignKey: 'PpsItemFk',
	// moduleName: 'productionplanning.item',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(PpsItemDataService);
	},

});
