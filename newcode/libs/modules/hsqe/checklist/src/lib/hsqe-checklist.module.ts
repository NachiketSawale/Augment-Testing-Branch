/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { HsqeChecklistModuleInfo } from './model/hsqe-checklist-module-info.class';
import { HSQE_CHECKLIST_DATA_TOKEN, HsqeChecklistDataService } from './services/hsqe-checklist-data.service';
import { HSQE_CHECKLIST_BEHAVIOR_TOKEN, HsqeChecklistBehavior } from './behaviors/hsqe-checklist-behavior.service';
import { HSQE_CHECKLIST_ACTIVITY_DATA_TOKEN, HsqeChecklistActivityDataService } from './services/hsqe-checklist-activity-data.service';
import { HSQE_CHECKLIST_FORM_DATA_TOKEN, HsqeChecklistFormDataService } from './services/hsqe-checklist-form-data.service';
import { HSQE_CHECKLIST_FORM_BEHAVIOR_TOKEN, HsqeChecklistFormBehavior } from './behaviors/hsqe-checklist-form-behavior.service';
import { HSQE_CHECKLIST_LOCATION_DATA_TOKEN, HsqeChecklistLocationDataService } from './services/hsqe-checklist-location-data.service';
import { HSQE_CHECKLIST_STRUCTURE_BEHAVIOR_TOKEN, HsqeChecklistStructureBehavior } from './behaviors/hsqe-checklist-structure-behavior.service';

const routes: Routes = [new BusinessModuleRoute(HsqeChecklistModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: HSQE_CHECKLIST_DATA_TOKEN, useExisting: HsqeChecklistDataService },
		{ provide: HSQE_CHECKLIST_BEHAVIOR_TOKEN, useExisting: HsqeChecklistBehavior },
		{ provide: HSQE_CHECKLIST_ACTIVITY_DATA_TOKEN, useExisting: HsqeChecklistActivityDataService },
		{ provide: HSQE_CHECKLIST_LOCATION_DATA_TOKEN, useExisting: HsqeChecklistLocationDataService },
		{ provide: HSQE_CHECKLIST_FORM_DATA_TOKEN, useExisting: HsqeChecklistFormDataService },
		{ provide: HSQE_CHECKLIST_FORM_BEHAVIOR_TOKEN, useExisting: HsqeChecklistFormBehavior },
		{ provide: HSQE_CHECKLIST_STRUCTURE_BEHAVIOR_TOKEN, useExisting: HsqeChecklistStructureBehavior },
	],
})
export class HsqeChecklistModule {}
