/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterParameterValueBehavior } from '../../behaviors/construction-system-master-parameter-value-behavior.service';
import { ConstructionSystemMasterParameterValueDataService } from '../../services/construction-system-master-parameter-value-data.service';
import { ConstructionSystemMasterParameterValueLayoutService } from '../../services/layouts/construction-system-master-parameter-value-layout.service';
import { ConstructionSystemMasterParameterValueValidationService } from '../../services/validations/construction-system-master-parameter-value-validation.service';
import { ICosParameterValueEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER_VALUE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosParameterValueEntity>({
	grid: {
		title: { key: 'constructionsystem.master.parameterValueGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterValueBehavior),
	},
	form: {
		title: { key: 'constructionsystem.master.parameterValueFormContainerTitle' },
		containerUuid: 'f312265433d140f7bb9f66cd7a026e32',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterValueDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterValueLayoutService).generateLayout(),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterValueValidationService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosParameterValueDto' },
	permissionUuid: 'f312265433d140f7bb9f00cd7a026e91',
});
