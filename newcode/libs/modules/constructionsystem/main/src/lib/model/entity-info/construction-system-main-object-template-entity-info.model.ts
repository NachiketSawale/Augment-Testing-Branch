/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosInsObjectTemplateEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainObjectTemplateLayoutService } from '../../services/layouts/construction-system-main-object-template-layout.service';
import { ConstructionSystemMainObjectTemplateDataService } from '../../services/construction-system-main-object-template-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosInsObjectTemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplateGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplateFormContainerTitle' },
		containerUuid: '5993871142644309b165d52701f6502b',
	},
	permissionUuid: '553196be4e394702bb9e9e86b6bc7a59',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'CosInsObjectTemplateDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainObjectTemplateDataService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMainObjectTemplateLayoutService).generateLayout(),
});
