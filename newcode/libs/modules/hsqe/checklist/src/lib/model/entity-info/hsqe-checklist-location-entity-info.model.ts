/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { HsqeChecklistLocationDataService } from '../../services/hsqe-checklist-location-data.service';
import { IHsqCheckList2LocationEntity } from '@libs/hsqe/interfaces';
import { MODULE_INFO_CHECKLIST } from './module-info-checklist.model';
import { HsqeChecklistLocationLayoutService } from '../../services/layouts/hsqe-checklist-location-layout.service';
import { HsqeChecklistLocationValidationService } from '../../services/validations/hsqe-checklist-location-validation.service';

export const HSQE_CHECKLIST_LOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqCheckList2LocationEntity>({
	grid: {
		title: { key: 'hsqe.checklist.location.title' },
	},
	form: {
		title: { key: 'hsqe.checklist.location.detailTitle' },
		containerUuid: '975d070855ba4b3482cc2bf19297d2ee',
	},
	validationService: (ctx) => ctx.injector.get(HsqeChecklistLocationValidationService),
	dataService: (ctx) => ctx.injector.get(HsqeChecklistLocationDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_CHECKLIST.ChecklistMainModuleName, typeName: 'HsqCheckList2LocationDto' },
	permissionUuid: '32330c1c8a1e493abf8b5182daa4d11f',
	layoutConfiguration: (context) => {
		return context.injector.get(HsqeChecklistLocationLayoutService).generateLayout();
	},
});
