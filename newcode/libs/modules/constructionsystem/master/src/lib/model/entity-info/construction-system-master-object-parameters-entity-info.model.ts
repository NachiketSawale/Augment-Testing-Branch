import { EntityInfo } from '@libs/ui/business-base';
import {
	ConstructionSystemMasterObject2ParamDataService
} from '../../services/construction-system-master-object2-param-data.service';


export const CONSTRUCTION_SYSTEM_MASTER_OBJECT_PARAMETERS_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: 'constructionsystem.main.instance2ObjectParamGridTitle'
	},
	dataService: context => context.injector.get(ConstructionSystemMasterObject2ParamDataService),
	dtoSchemeId: {
		moduleSubModule: 'ConstructionSystem.Main',
		typeName: 'Instance2ObjectParamDto'
	},
	//todo layoutConfiguration:
	permissionUuid: ''
});