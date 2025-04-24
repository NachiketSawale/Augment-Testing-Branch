/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosControllingGroupEntity } from '../models';
import { ConstructionSystemMasterControllingGroupDataService } from '../../services/construction-system-master-controlling-group-data.service';
import { ConstructionSystemMasterControllingGroupLayoutService } from '../../services/layouts/construction-system-master-controlling-group-layout.service';
import { ConstructionSystemMasterControllingGroupValidationService } from '../../services/validations/construction-system-master-controlling-group-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_CONTROLLING_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosControllingGroupEntity>({
	grid: {
		title: { key: 'constructionsystem.master.controllingGroupGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.controllingGroupFormContainerTitle' },
		containerUuid: 'dc659b57e6f943be84a334a16d08dc96',
	},
	permissionUuid: '9a833119c0594c3eb541364e8e4c7136',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosControllingGroupDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterControllingGroupDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterControllingGroupValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterControllingGroupLayoutService).generateLayout(),
});
