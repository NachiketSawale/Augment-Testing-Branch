/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { ICosObjectTemplateProperty2TemplateEntity } from '../models';
import { ConstructionSystemMasterObjectTemplatePropertyLayoutService } from '../../services/layouts/construction-system-master-object-template-property-layout.service';
import { ConstructionSystemMasterObjectTemplateProperty2TemplateDataService } from '../../services/construction-system-master-object-template-property2-template-data.service';
import { ConstructionSystemMasterObjectTemplateProperty2TemplateValidationService } from '../../services/validations/construction-system-master-object-template-property2-template-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY2_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosObjectTemplateProperty2TemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplateProperty2TemplateGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplateProperty2TemplateFormContainerTitle' },
		containerUuid: 'b74fbd432f7e470194efcfd460e0ff24',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplateProperty2TemplateDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplateProperty2TemplateValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplatePropertyLayoutService<ICosObjectTemplateProperty2TemplateEntity>).generateLayout(ctx),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosObjectTemplateProperty2TemplateDto' },
	permissionUuid: '193e273962d747bc94d4a9c82782e000',
});
