/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { PhaseTemplateEntity } from '../phase-template-entity.class';
import {
	ProductionplanningProcessconfigurationPhaseTemplateDataService
} from '../../services/productionplanning-processconfiguration-phase-template-data.service';
import {
	ProductionplanningProcessconfigurationPhaseTemplateGridBehavior
} from '../../behaviors/phase-template-grid-behavior.service';

import { PpsPhaseTemplateValidationService } from '../../services/phase-template-validation.service';
import { PpsPhaseTemplateLayoutService } from '../../services/layouts/phase-template-layout.service';

export const PPS_PHASE_TEMPLATE_ENTITY_INFO = EntityInfo.create<PhaseTemplateEntity>({
	grid: {
		title: { text: 'Phase Template', key: 'productionplanning.processconfiguration.phaseTemplate.ListTitle' },
		behavior: ctx => ctx.injector.get(ProductionplanningProcessconfigurationPhaseTemplateGridBehavior)
	},
	form: {
		title: {
			text: 'Phase Template Detail',
			key: 'productionplanning.processconfiguration.phaseTemplate.detailTitle'
		},
		containerUuid: '16109c4d63794f86812d51fbfe8eaedb'
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningProcessconfigurationPhaseTemplateDataService),
	validationService: (ctx) => ctx.injector.get(PpsPhaseTemplateValidationService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.ProcessConfiguration', typeName: 'PhaseTemplateDto' },
	permissionUuid: '71b79353b3084571b7b450a492a7fd56',
	layoutConfiguration: context => {
		return context.injector.get(PpsPhaseTemplateLayoutService).generateLayout();
	},
});
