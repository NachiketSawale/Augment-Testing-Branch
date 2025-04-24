/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EntityDomainType } from '@libs/platform/data-access';
import { ICosTestInputEntity } from '../models';
import { ConstructionSystemMasterTestInputBehaviorService } from '../../behaviors/construction-system-master-test-input-behavior.service';
import { ConstructionSystemMasterTestInputValidationService } from '../../services/validations/construction-system-master-test-input-validation.service';
import { ConstructionSystemMasterTestParameterInputDataService } from '../../services/construction-system-master-test-parameter-input-data.service';
import { ConstructionSystemMasterTestParameterInputLayoutService } from '../../services/layouts/construction-system-master-test-parameter-input-layout.service';

export const CONSTRUCTION_SYSTEM_MASTER_TEST_PARAMETER_INPUT_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosTestInputEntity>({
	grid: {
		title: { key: 'constructionsystem.master.testInputGridContainerTitle' },
		treeConfiguration: true,
	},
	form: {
		title: { key: 'constructionsystem.master.testInputFormContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMasterTestInputBehaviorService),
		containerUuid: 'a758baf3dc574a8dace61dac349d3f62',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterTestParameterInputDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterTestInputValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterTestParameterInputLayoutService).generateLayout(),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosTestInputDto' },
	permissionUuid: '59c5523f1b754e3fb4aea87f7b1b2cb1',
	entitySchema: {
		schema: 'ICosTestInputEntity',
		properties: {
			UomFk: { domain: EntityDomainType.Integer, mandatory: true },
			VariableName: { domain: EntityDomainType.Description, mandatory: false },
			DescriptionInfo: { domain: EntityDomainType.Translation, mandatory: false },
			PropertyName: { domain: EntityDomainType.Comment, mandatory: false },
			BasFormFieldFk: { domain: EntityDomainType.Integer, mandatory: false },
			QuantityQueryInfo: { domain: EntityDomainType.Translation, mandatory: false },
			Value: { domain: EntityDomainType.Description, mandatory: false },

			ProjectFk: { domain: EntityDomainType.Integer, mandatory: false },
			CosInsHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			EstHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			ModelFk: { domain: EntityDomainType.Integer, mandatory: false },
			PsdScheduleFk: { domain: EntityDomainType.Integer, mandatory: false },
			BoqHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
		},
	},
});
