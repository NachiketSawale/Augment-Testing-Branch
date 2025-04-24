import { PpsCommonPrj2bpEntityInfoFactory } from '@libs/productionplanning/common';
import { EntityInfo } from '@libs/ui/business-base';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { IEngTaskEntity } from './models';

export const ENG_TASK_PRJ2BP_ENTITY_INFO: EntityInfo = PpsCommonPrj2bpEntityInfoFactory.create<IEngTaskEntity>({
	containerUuid: '4c8866b319f74459994d1595a56fcc3e',
	permissionUuid: 'B15A05E067094D3988F4626281C88E24',
	gridTitle: { text: '*Project Partners', key: 'project.main.listPrj2BpTitle' },
	projectFkField: 'ProjectId',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
});
