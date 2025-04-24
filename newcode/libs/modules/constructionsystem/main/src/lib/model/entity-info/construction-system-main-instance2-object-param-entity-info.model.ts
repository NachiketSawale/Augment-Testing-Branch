import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemCommonInstance2ObjectParamLayoutService } from '@libs/constructionsystem/common';
import { IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstance2ObjectParamDataService } from '../../services/construction-system-main-instance2-object-param-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_PARAM_ENTITY_INFO = EntityInfo.create<IInstance2ObjectParamEntity>({
	grid: {
		title: { key: 'constructionsystem.main.instance2ObjectParamGridTitle' },
		containerUuid: 'f6733538a0334b299c76c460e12ce569',
	},
	form: {
		title: { key: 'constructionsystem.main.Instance2ObjectParamFormTitle' },
		containerUuid: '6574b0fa40fc4e46a2d9b6788cdb218e',
	},
	permissionUuid: 'f6733538a0334b299c76c460e12ce569',
	dataService: (context) => context.injector.get(ConstructionSystemMainInstance2ObjectParamDataService),
	dtoSchemeId: {
		moduleSubModule: 'ConstructionSystem.Main',
		typeName: 'Instance2ObjectParamDto',
	},
	layoutConfiguration: (context) => context.injector.get(ConstructionSystemCommonInstance2ObjectParamLayoutService).generateLayout(),
});