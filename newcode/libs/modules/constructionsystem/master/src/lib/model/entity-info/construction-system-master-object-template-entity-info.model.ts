/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemSharedObjectTemplateLayoutService } from '@libs/constructionsystem/shared';
import { ICosObjectTemplateEntity } from '../models';
import { ConstructionSystemMasterObjectTemplateDataService } from '../../services/construction-system-master-object-template-data.service';
import { ConstructionSystemMasterObjectTemplateBehaviorService } from '../../behaviors/construction-system-master-object-template-behavior.service';
import { ConstructionSystemMasterObjectTemplateDetailBehaviorService } from '../../behaviors/construction-system-master-object-template-detail-behavior.service';

export const CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosObjectTemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplateGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplateBehaviorService),
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplateFormContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplateDetailBehaviorService),
		containerUuid: 'fcb2a29ce70f4a1db8489cc5c997431b',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplateDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemSharedObjectTemplateLayoutService).generateLayout(),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosObjectTemplateDto' },
	permissionUuid: '2e51def88fbb40bbbb53876e54de22c9',
});
