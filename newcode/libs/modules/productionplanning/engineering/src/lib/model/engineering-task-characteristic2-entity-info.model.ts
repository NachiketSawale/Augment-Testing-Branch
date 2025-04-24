import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';

export const ENGINEERING_TASK_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: '96aa45a03042461d9ac85a4786595458',
	sectionId: BasicsCharacteristicSection.Engineering2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EngineeringTaskDataService);
	},
	isParentReadonlyFn: (parentService) => {
		return false;
	},
});
