/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterParameterBehavior } from '../../behaviors/construction-system-master-parameter-behavior.service';
import { ConstructionSystemMasterParameterDataService } from '../../services/construction-system-master-parameter-data.service';
import { ConstructionSystemMasterParameterLayoutService } from '../../services/layouts/construction-system-master-parameter-layout.service';
import { ConstructionSystemMasterParameterValidationService } from '../../services/validations/construction-system-master-parameter-validation.service';
import { ICosParameterEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosParameterEntity>({
	grid: {
		title: { key: 'constructionsystem.master.parameterGridContainerTitle' },
		containerUuid: '1bf54e1872ea4559bc95a1c2c6152450',
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterBehavior),
	},
	form: {
		title: { key: 'constructionsystem.master.parameterFormContainerTitle' },
		containerUuid: '1bf54e1802ea4559bc95a1c2c6152454',
	},
	permissionUuid: '1bf54e1802ea4559bc95a1c2c6152450',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosParameterDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterLayoutService).generateLayout(),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterValidationService),
});
