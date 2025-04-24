/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ICosObjectTemplatePropertyEntity } from '../models';
import { ConstructionSystemMasterObjectTemplatePropertyDataService } from '../../services/construction-system-master-object-template-property-data.service';
import { ConstructionSystemMasterObjectTemplatePropertyValidationService } from '../../services/validations/construction-system-master-object-template-property-validation.service';
import { ConstructionSystemMasterObjectTemplatePropertyLayoutService } from '../../services/layouts/construction-system-master-object-template-property-layout.service';

export const CONSTRUCTION_SYSTEM_MASTER_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosObjectTemplatePropertyEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplatePropertyGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplatePropertyFormContainerTitle' },
		containerUuid: '29aba7c0e5bb464b894a477169cd5233',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplatePropertyDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplatePropertyValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterObjectTemplatePropertyLayoutService<ICosObjectTemplatePropertyEntity>).generateLayout(ctx),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosObjectTemplatePropertyDto' },
	permissionUuid: '83ef6ff7f7704edc9a2f1b50bd35690d',
});
