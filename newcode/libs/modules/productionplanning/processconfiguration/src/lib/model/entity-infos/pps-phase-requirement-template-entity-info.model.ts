/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { PhaseRequirementTemplateEntity } from '../phase-requirement-template-entity.class';
import { PhaseRequirementTemplateGridBehavior } from '../../behaviors/phase-requirement-template-grid-behavior.service';
import { PhaseRequirementTemplateFormBehavior } from '../../behaviors/phase-requirement-template-form-behavior.service';
import { PpsPhaseRequirementTemplateDateService } from '../../services/phase-requirement-template-data.service';
import { PpsPhaseRequirementTemplateValidationService } from '../../services/phase-requirement-template-validation.service';
import { PpsPhaseRequirementTemplateLayoutService } from '../../services/layouts/phase-requirement-template-layout.service';

export const PPS_PHASE_REQUIREMENT_TEMPLATE_ENTITY_INFO = EntityInfo.create<PhaseRequirementTemplateEntity>({
	grid: {
		title: { text: 'Phase Requirement Templates', key: 'productionplanning.processconfiguration.phasereqtemplate.listTitle' },
		behavior: ctx => ctx.injector.get(PhaseRequirementTemplateGridBehavior)
	},
	form: {
		title: { text: 'Phase Requirement Template Detail', key: 'productionplanning.processconfiguration.phasereqtemplate.detailTitle' },
		behavior: (ctx) => ctx.injector.get(PhaseRequirementTemplateFormBehavior),
		containerUuid: 'ca54a429c4d44e11b51e54ffa81eb75b'
	},
	dataService: ctx => ctx.injector.get(PpsPhaseRequirementTemplateDateService),
	validationService: (ctx) => ctx.injector.get(PpsPhaseRequirementTemplateValidationService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.ProcessConfiguration', typeName: 'PhaseReqTemplateDto' },
	permissionUuid: 'e15dcf861fdc40a4a9c277201fbfe424',
	layoutConfiguration: context => {
		return context.injector.get(PpsPhaseRequirementTemplateLayoutService).generateLayout();
	},
});
