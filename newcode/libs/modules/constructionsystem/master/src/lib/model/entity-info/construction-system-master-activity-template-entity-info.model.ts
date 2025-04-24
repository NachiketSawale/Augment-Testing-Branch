/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICosActivityTemplateEntity } from '../models';
import { ConstructionSystemMasterActivityTemplateDataService } from '../../services/construction-system-master-activity-template-data.service';
import { ConstructionSystemMasterActivityTemplateLayoutService } from '../../services/layouts/construction-system-master-activity-template-layout.service';
import { ConstructionSystemMasterActivityTemplateValidationService } from '../../services/validations/construction-system-master-activity-template-validation.service';

export const CONSTRUCTION_SYSTEM_MASTER_ACTIVITY_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosActivityTemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.activityTemplateGridContainerTitle' },
		// behavior: todo-allen: Wait for the framework to finish the button: bulkEditor
	},
	form: {
		title: { key: 'constructionsystem.master.activityTemplateFormContainerTitle' },
		containerUuid: '14cae87b5c294052a8cfb8a733ace89a',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterActivityTemplateDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterActivityTemplateValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterActivityTemplateLayoutService).generateLayout(),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosActivityTemplateDto' },
	permissionUuid: 'b13b068f2f7c439d8eaa3df7d66ebb96',
	entitySchema: {
		schema: 'ICosActivityTemplateEntity',
		properties: {
			Code: { domain: EntityDomainType.Code, mandatory: true },
			CommentText: { domain: EntityDomainType.Comment, mandatory: false },
			ActivityTemplateFk: { domain: EntityDomainType.Integer, mandatory: false },
		},
		additionalProperties: {
			'ActivityTemplate.SchedulingMethodFk': { domain: EntityDomainType.Integer, mandatory: false },
			'ActivityTemplate.TaskTypeFk': { domain: EntityDomainType.Integer, mandatory: false },
			'ActivityTemplate.ConstraintTypeFk': { domain: EntityDomainType.Integer, mandatory: false },
			'ActivityTemplate.ActivityPresentationFk': { domain: EntityDomainType.Integer, mandatory: false },
			'ActivityTemplate.ProgressReportMethodFk': { domain: EntityDomainType.Integer, mandatory: false },
			'ActivityTemplate.QuantityUoMFk': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.Perf1UoMFk': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.Perf2UoMFk': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.Specification': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.ControllingUnitTemplate': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.PerformanceFactor': { domain: EntityDomainType.Description, mandatory: false },
			'ActivityTemplate.DescriptionInfo.Description': { domain: EntityDomainType.Description, mandatory: false },
		},
	},
});
