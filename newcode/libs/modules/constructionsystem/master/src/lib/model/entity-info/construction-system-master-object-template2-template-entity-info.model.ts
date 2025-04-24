/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemSharedObjectTemplateLayoutService } from '@libs/constructionsystem/shared';
import { ICosObjectTemplate2TemplateEntity } from '../entities/cos-object-template-2-template-entity.interface';
import { ConstructionSystemMasterObjectTemplate2TemplateDataService } from '../../services/construction-system-master-object-template2-template-data.service';
import { ConstructionSystemMasterObjectTemplate2TemplateDetailBehavior } from '../../behaviors/construction-system-master-object-template2-template-detail-behavior.service';

export const CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE2_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosObjectTemplate2TemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplate2TemplateGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplate2TemplateFormContainerTitle' },
		containerUuid: 'e36ceb46cae143ada0413d8e0f21737d',
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplate2TemplateDetailBehavior),
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplate2TemplateDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemSharedObjectTemplateLayoutService<ICosObjectTemplate2TemplateEntity>).generateLayout(),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosObjectTemplate2TemplateDto' },
	permissionUuid: '25cdff39a402445188247d0096836cc2',
});
