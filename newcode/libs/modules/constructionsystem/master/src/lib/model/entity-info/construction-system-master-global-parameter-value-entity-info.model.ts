/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosGlobalParamValueEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterValueDataService } from '../../services/construction-system-master-global-parameter-value-data.service';
import { ConstructionSystemMasterGlobalParameterValueLayoutService } from '../../services/layouts/construction-system-master-global-parameter-value-layout.service';
import { ConstructionSystemMasterGlobalParameterValueValidationService } from '../../services/validations/construction-system-master-global-parameter-value-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_VALUE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosGlobalParamValueEntity>({
	grid: {
		title: { key: 'constructionsystem.master.globalParameterValueGridContainerTitle' },
		// behavior: todo-allen: Wait for the framework to finish the button: bulkEditor.
	},
	form: {
		title: { key: 'constructionsystem.master.globalParameterValueFormContainerTitle' },
		containerUuid: '42555609fbcd47aeb64468d270a648ab',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterValueDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterValueLayoutService).generateLayout(),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterValueValidationService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosParameterValueDto' },
	permissionUuid: 'a096f97b3ef242febe7219478f06f9b4',
});
