/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosGlobalParamEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterDataService } from '../../services/construction-system-master-global-parameter-data.service';
import { ConstructionSystemMasterGlobalParameterLayoutService } from '../../services/layouts/construction-system-master-global-parameter-layout.service';
import { ConstructionSystemMasterGlobalParameterValidationService } from '../../services/validations/construction-system-master-global-parameter-vaildation.service';

export const CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosGlobalParamEntity>({
	grid: {
		title: { key: 'constructionsystem.master.globalParameterGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.globalParameterFormContainerTitle' },
		containerUuid: 'aab5cdd616ba0498daaeb8215c3c6022',
	},
	permissionUuid: 'd736297005f9469d93d09a14c59fe414',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosGlobalParamDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterLayoutService).generateLayout(),
});
