/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ChecklistTemplateFormDataService } from '../../services/checklist-template-form-data.service';
import { IHsqChkListTemplate2FormEntity } from '@libs/hsqe/interfaces';
import { ChecklistTemplateFormLayoutService } from '../../services/layouts/checklist-template-form-layout.service';
import { ChecklistTemplate2FormBehavior } from '../../services/behaviors/checklist-template-form-behavior.service';
import { ChecklistTemplateFormValidationService } from '../../services/validations/checklist-template-form-validation.service';

export const CHECKLIST_TEMPLATE_FORM_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqChkListTemplate2FormEntity>({
	grid: {
		title: { key: 'hsqe.checklisttemplate.checkTemplate2FromGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ChecklistTemplate2FormBehavior),
	},
	form: {
		title: { key: 'hsqe.checklist.form.detailTitle' },
		containerUuid: 'd67472a8fa5f4a8ebb0668dbc4d5386c',
	},
	dataService: (ctx) => ctx.injector.get(ChecklistTemplateFormDataService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckListTemplate', typeName: 'HsqChkListTemplate2FormDto' },
	permissionUuid: 'cc6d6d1dc805468491510463099d8809',
	layoutConfiguration: (context) => {
		return context.injector.get(ChecklistTemplateFormLayoutService).generateLayout();
	},
	validationService: (context) => context.injector.get(ChecklistTemplateFormValidationService),
});
