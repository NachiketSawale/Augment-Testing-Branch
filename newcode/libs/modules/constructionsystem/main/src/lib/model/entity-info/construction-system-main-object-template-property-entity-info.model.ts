/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICosInsObjectTemplatePropertyEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainObjectTemplatePropertyDataService } from '../../services/construction-system-main-object-template-property-data.service';
import { ConstructionSystemMainObjectTemplatePropertyLayoutService } from '../../services/layouts/construction-system-main-object-template-property-layout.service';
import { ConstructionSystemMainObjectTemplatePropertyValidationService } from '../../services/validations/construction-system-main-object-template-property-vaildation.service';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT_TEMPLATE_PROPERTY_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosInsObjectTemplatePropertyEntity>({
	grid: {
		title: { key: 'constructionsystem.master.2dObjectTemplatePropertyGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.2dObjectTemplatePropertyFormContainerTitle' },
		containerUuid: 'fd0073b62d8142fe87072c49d31aac3c',
	},
	permissionUuid: '7e8e5c39d3314b87a23f8277ee0335e2',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'CosInsObjectTemplatePropertyDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainObjectTemplatePropertyDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMainObjectTemplatePropertyValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMainObjectTemplatePropertyLayoutService).generateLayout(),
	entitySchema: {
		schema: 'CosInsObjectTemplatePropertyDto',
		properties: {
			MdlPropertyKeyFk: { domain: EntityDomainType.Integer, mandatory: true },
			BasUomFk: { domain: EntityDomainType.Integer, mandatory: false },
			Formula: { domain: EntityDomainType.Description, mandatory: false },
		},
		additionalProperties: {
			Value: { domain: EntityDomainType.Description, mandatory: false }, //todo: dynamic field
		},
	},
});
