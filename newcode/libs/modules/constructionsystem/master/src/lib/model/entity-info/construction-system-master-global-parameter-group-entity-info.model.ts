/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterGlobalParameterGroupLayoutService } from '../../services/layouts/construction-system-master-global-parameter-group-layout.service';
import { ConstructionSystemMasterGlobalParameterGroupValidationService } from '../../services/validations/construction-system-master-global-parameter-group-validation.service';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterGroupDataService } from '../../services/construction-system-master-global-parameter-group-data.service';

export const CONSTRUCTION_SYSTEM_MASTER_GLOBAL_PARAMETER_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosGlobalParamGroupEntity>({
	grid: {
		title: { key: 'constructionsystem.master.globalParamGroupTitle' },
		treeConfiguration: true,
	},
	form: {
		title: { key: 'constructionsystem.master.globalParamGroupDetail' },
		containerUuid: '1f974111b07143ab81bbcaca9aeee6a2',
	},
	permissionUuid: '6649459c8df046b3bbaaf3ceec4233fd',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosGlobalParamGroupDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterGroupDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterGroupValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterGlobalParameterGroupLayoutService).generateLayout(),
});
