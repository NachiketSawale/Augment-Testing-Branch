/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsCostGroupEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { get } from 'lodash';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { IEngTaskEntity } from './models';

export const ENG_TASK_COST_GROUP_ENTITY_INFO: EntityInfo = PpsCostGroupEntityInfoFactory.create<IEngTaskEntity/*, EngTaskComplete */>({
	containerUuid: 'fh026f94a1ghvf17ty967dgaf26a5cgj',
	permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	apiUrl: 'productionplanning/engineering/task',
	dataLookupType: 'Engineering2CostGroups',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
	provideReadDataFn: (selectedParent: object) => {
		return {
			PKey1: get(selectedParent, 'ProjectId'),
			PKey2: get(selectedParent, 'PpsEventFk'),
		};
	},
	getMainItemIdFn: (selectedParent: object) => {
		return get(selectedParent, 'PpsEventFk') as unknown as number;
	}

});
