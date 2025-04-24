/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { HsqeChecklistFormDataService } from '../../services/hsqe-checklist-form-data.service';
import { HsqeChecklistFormBehavior } from '../../behaviors/hsqe-checklist-form-behavior.service';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistFormDataLayoutService } from '../../services/layouts/hsqe-checklist-form-data-layout.service';
import { HsqeChecklistFormValidationService } from '../../services/validations/hsqe-checklist-form-validation.service';

export const HSQE_CHECKLIST_FORM_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqCheckList2FormEntity>({
	grid: {
		title: { key: 'hsqe.checklist.form.title' },
		behavior: (ctx) => ctx.injector.get(HsqeChecklistFormBehavior),
	},
	form: {
		title: { key: 'hsqe.checklist.form.detailTitle' },
		containerUuid: 'f489c3243fbd41038f8679e3f9fcfcd8',
	},
	dataService: (ctx) => ctx.injector.get(HsqeChecklistFormDataService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckList', typeName: 'HsqCheckList2FormDto' },
	permissionUuid: '2334381acd314b488be8c8828d7595b2',
	layoutConfiguration: (context) => {
		return context.injector.get(HsqeChecklistFormDataLayoutService).generateLayout();
	},
	validationService: (context) => context.injector.get(HsqeChecklistFormValidationService),
});
