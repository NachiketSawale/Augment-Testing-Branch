/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterGroupDataService } from '../../services/construction-system-master-group-data.service';
import { ConstructionSystemMasterGroupBehavior } from '../../behaviors/construction-system-master-group-behavior.service';
import { ICosGroupEntity } from '../models';
import { ConstructionSystemMasterGroupLayoutService } from '../../services/layouts/construction-system-master-group-layout.service';
import { ConstructionSystemMasterGroupValidationService } from '../../services/validations/construction-system-master-group-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosGroupEntity>({
	grid: {
		title: { key: 'constructionsystem.master.groupGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterGroupBehavior),
		treeConfiguration: true,
	},
	form: {
		title: { key: 'constructionsystem.master.groupFormContainerTitle' },
		containerUuid: '189564016710460192353d6dd68daa44',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterGroupDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterGroupLayoutService).generateLayout(),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterGroupValidationService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosGroupDto' },
	permissionUuid: '7fb0f988359341e6950d9f679d0c7b62',
});
