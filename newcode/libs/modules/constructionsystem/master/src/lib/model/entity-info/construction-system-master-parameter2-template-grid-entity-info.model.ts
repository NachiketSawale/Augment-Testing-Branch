/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import {
	ConstructionSystemMasterParameter2TemplateGridDataService
} from '../../services/construction-system-master-parameter2-template-grid-data.service';
import { ICosParameter2TemplateEntity } from '../entities/cos-parameter-2-template-entity.interface';
import {
	ConstructionSystemMasterParameter2TemplateValidationService
} from '../../services/validations/construction-system-master-parameter2-template-validation.service';
import {
	ConstructionSystemMasterParameter2TemplateLayoutService
} from '../../services/layouts/construction-system-master-parameter2-template-layout.service';

export const CONSTRUCTION_SYSTEM_MASTER_PARAMETER2_TEMPLATE_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosParameter2TemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.parameter2TemplateGridContainerTitle' },
	},
	form: {
		title: { key: 'constructionsystem.master.parameter2TemplateFormContainerTitle' },
		containerUuid: '6058b3709bbc4faeb8425512d7cc5d95',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameter2TemplateGridDataService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosParameter2TemplateDto' },
	// entitySchema: {
	// 	schema: '',
	// 	additionalProperties: {
	// 		//, 'CosParameter.VariableName', 'CosParameter.UoM', 'CosParameter.ParameterTypeDescription'
	// 		'CosParameter.ParameterGroupDescription': {
	// 			domain: EntityDomainType.Description,
	// 			mandatory: false
	// 		}
	// 	}
	// },
	permissionUuid: '907a9e74be7245b4b277cbf4febd6806',
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterParameter2TemplateValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterParameter2TemplateLayoutService).generateLayout(),
});
