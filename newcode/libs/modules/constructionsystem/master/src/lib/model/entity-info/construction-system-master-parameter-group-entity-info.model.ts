/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterParameterGroupDataService } from '../../services/construction-system-master-parameter-group-data.service';
import { ConstructionSystemMasterParameterGroupLayoutService } from '../../services/layouts/construction-system-master-parameter-group-layout.service';
import { ConstructionSystemMasterParameterGroupValidationService } from '../../services/validations/construction-system-master-parameter-group-validation.service';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosParameterGroupEntity>({
	grid: {
		title: { key: 'constructionsystem.master.parameterGroupGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.parameterGroupFormContainerTitle' },
		containerUuid: '27cf0f655bd94dbbb424deee45547e35',
	},
	permissionUuid: '37cf0f655bd94dbbb424deee45547e32',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosParameterGroupDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterGroupDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterGroupValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterParameterGroupLayoutService).generateLayout(),
});
