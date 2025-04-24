/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { DrawingDataService } from '../services/drawing-data.service';
import { IEngDrawingEntity } from './entities/eng-drawing-entity.interface';
import { get } from 'lodash';
// import { EngDrawingComplete } from './eng-drawing-complete.class';

export const PPS_DRAWING_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IEngDrawingEntity/*, EngDrawingComplete */>({
	containerUuid: 'xx026f94a1f548178496704af26a5cxx',
	permissionUuid: '231c11dda4004fed84984b86488089be',
	apiUrl: 'productionplanning/drawing',
	dataLookupType: 'Drawing2CostGroups',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(DrawingDataService);
	},
	provideReadDataFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'PrjProjectFk'),
			PKey2: get(selectedParent, 'Id'),
		};
	},
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'Id') as unknown as number;
	}

});
