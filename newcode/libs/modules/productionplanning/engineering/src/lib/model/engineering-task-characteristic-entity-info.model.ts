import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';

export const ENGINEERING_TASK_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '8cf6520de6114c88928ff900ede5504c',
	sectionId: BasicsCharacteristicSection.Engineering,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});
