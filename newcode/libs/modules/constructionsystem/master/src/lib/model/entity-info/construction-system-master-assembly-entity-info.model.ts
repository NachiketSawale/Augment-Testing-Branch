/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosAssemblyEntity } from '../models';
import { ConstructionSystemMasterAssemblyDataService } from '../../services/construction-system-master-assembly-data.service';
import { ConstructionSystemMasterAssemblyLayoutService } from '../../services/layouts/construction-system-master-assembly-layout.service';
import { ConstructionSystemMasterAssemblyValidationService } from '../../services/validations/construction-system-master-assembly-validation.service';
import { ConstructionSystemMasterAssemblyBehaviorService } from '../../behaviors/construction-system-master-assembly-behavior.service';

export const CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosAssemblyEntity>({
	grid: {
		title: { key: 'constructionsystem.master.assemblyGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterAssemblyBehaviorService),
	},
	form: {
		title: { key: 'constructionsystem.master.assemblyFormContainerTitle' },
		containerUuid: '068f5a3774344f85905a18abd2fc3e2a',
	},
	permissionUuid: '12ed89f703f9484d8934a967da15bbe4',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosAssemblyDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterAssemblyDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterAssemblyValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterAssemblyLayoutService).generateLayout(),
});
