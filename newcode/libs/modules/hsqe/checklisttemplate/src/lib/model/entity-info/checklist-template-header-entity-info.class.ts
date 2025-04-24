/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { CheckListTemplateHeaderLayoutService } from '../../services/layouts/checklist-template-header-layout.service';
import { CheckListTemplateHeaderDataService } from '../../services/checklist-template-header-data.service';
import { CheckListTemplateHeaderValidationService } from '../../services/validations/checklist-template-header-validation.service';
import { CheckListTemplateBehavior } from '../../services/behaviors/checklist-template-behavior.service';

export const CHECKLIST_TEMPLATE_HEADER_INFO: EntityInfo = EntityInfo.create<IHsqChkListTemplateEntity>({
	grid: {
		title: { text: 'Template', key: 'hsqe.checklisttemplate.headerGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(CheckListTemplateBehavior),
	},
	form: {
		containerUuid: '50d972a001f94e1797737f3d4457f508',
		title: { text: 'Template Detail', key: 'hsqe.checklisttemplate.headerFormContainerTitle' },
	},
	dataService: (ctx) => ctx.injector.get(CheckListTemplateHeaderDataService),
	validationService: (ctx) => ctx.injector.get(CheckListTemplateHeaderValidationService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckListTemplate', typeName: 'HsqChkListTemplateDto' },
	permissionUuid: '38c695e4561b426da29491a95c08f4b6',
	layoutConfiguration: (context) => {
		return context.injector.get(CheckListTemplateHeaderLayoutService).generateLayout();
	},
});
