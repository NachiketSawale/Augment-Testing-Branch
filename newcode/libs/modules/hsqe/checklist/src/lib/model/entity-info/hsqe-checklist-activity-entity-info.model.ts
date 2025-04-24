/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_CHECKLIST } from './module-info-checklist.model';
import { IHsqCheckList2ActivityEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistActivityDataService } from '../../services/hsqe-checklist-activity-data.service';
import { HsqeChecklistActivityLayoutService } from '../../services/layouts/hsqe-checklist-activity-layout.service';
import { HsqeChecklistActivityValidationService } from '../../services/validations/hsqe-checklist-activity-validation.service';

export const HSQE_CHECKLIST_ACTIVITY_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqCheckList2ActivityEntity>({
	grid: {
		title: { key: 'hsqe.checklist.activity.title' },
	},
	form: {
		title: { key: 'hsqe.checklist.activity.detailTitle' },
		containerUuid: 'f9f82db88b643abab73564c8a2ffdfd',
	},
	dataService: (ctx) => ctx.injector.get(HsqeChecklistActivityDataService),
	validationService: (ctx) => ctx.injector.get(HsqeChecklistActivityValidationService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_CHECKLIST.ChecklistMainModuleName, typeName: 'HsqCheckList2ActivityDto' },
	permissionUuid: '89b8c86e8d53480ebc2551a33f010e94',
	layoutConfiguration: (context) => {
		return context.injector.get(HsqeChecklistActivityLayoutService).generateLayout();
	},
});
