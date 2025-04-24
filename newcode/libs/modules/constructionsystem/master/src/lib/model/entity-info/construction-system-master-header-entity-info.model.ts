/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemSharedHeaderLayoutService, ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterHeaderBehavior } from '../../behaviors/construction-system-master-header-behavior.service';
import { ConstructionSystemMasterClipboardService } from '../../services/construction-system-master-clipboard.service';
import { ConstructionSystemMasterHeaderDataService } from '../../services/construction-system-master-header-data.service';
import { ConstructionSystemMasterHeaderValidationService } from '../../services/validations/construction-system-master-header-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosHeaderEntity>({
	grid: {
		title: { key: 'constructionsystem.master.headerGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterHeaderBehavior),
		permission: 'df958953d5774978a24be290074c2fdc',
	},
	form: {
		title: { key: 'constructionsystem.master.headerFormContainerTitle' },
		containerUuid: 'fd415cfda30f423caa757762f9f9d6de',
		permission: 'df958953d5774978a24be290074c2fdc',
	},
	permissionUuid: 'acc544c6504a4a678dbe74d8f390eea8',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosHeaderDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterHeaderDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemSharedHeaderLayoutService).generateLayout(),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterHeaderValidationService),
	dragDropService: (ctx) => ctx.injector.get(ConstructionSystemMasterClipboardService),
});
