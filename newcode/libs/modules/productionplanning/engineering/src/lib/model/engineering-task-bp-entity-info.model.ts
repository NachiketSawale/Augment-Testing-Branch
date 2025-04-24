/*
* Copyright(c) RIB Software GmbH
*/
import { EntityInfo } from '@libs/ui/business-base';
import {
	PpsCommonBizPartnerEntityInfoFactory,
} from '@libs/productionplanning/common';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { IEngTaskEntity } from './models';

export const ENGINEERING_TASK_BP_ENTITY_INFO: EntityInfo = PpsCommonBizPartnerEntityInfoFactory.create<IEngTaskEntity>({
	containerUuid: 'ebc3f90b8cf04ddaac0b78fd95df0af0',
	permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	gridTitle: { text: '*Business Partners', key: 'productionplanning.item.listBizPartnerTitle' },
	projectFkField: 'PPSItem_ProjectFk',
	ppsHeaderFkField: 'PPSItem_PpsHeaderFk',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
});
