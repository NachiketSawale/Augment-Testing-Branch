/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { SchedulingTemplategroupModuleInfo } from './model/scheduling-templategroup-module-info.class';
import { SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP_EDIT_DATA_TOKEN, SchedulingTemplateActivityTemplateGroupDataService } from './services/scheduling-template-activity-template-group-data.service';
//import { SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP_EDIT_BEHAVIOR_TOKEN, SchedulingTemplateActivityTmplGrpEditBehavior } from './behaviors/scheduling-template-activity-tmpl-grp-edit-behavior.service';
import { SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP2_CUGRP_DATA_TOKEN, SchedulingTemplateActivityTemplateGroup2CugroupDataService } from './services/scheduling-template-activity-template-group2-cugroup-data.service';
//import { SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP2_CUGRP_BEHAVIOR_TOKEN, SchedulingTemplateActivityTmplGrp2CUGrpBehavior } from './behaviors/scheduling-template-activity-tmpl-grp2-cugrp-behavior.service';

const routes: Routes = [new ContainerModuleRoute(SchedulingTemplategroupModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP_EDIT_DATA_TOKEN, useExisting: SchedulingTemplateActivityTemplateGroupDataService },
		//{ provide: SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP_EDIT_BEHAVIOR_TOKEN, useExisting: SchedulingTemplateActivityTmplGrpEditBehavior },
		{ provide: SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP2_CUGRP_DATA_TOKEN, useExisting: SchedulingTemplateActivityTemplateGroup2CugroupDataService },
		//{ provide: SCHEDULING_TEMPLATE_ACTIVITY_TMPL_GRP2_CUGRP_BEHAVIOR_TOKEN, useExisting: SchedulingTemplateActivityTmplGrp2CUGrpBehavior },
	],
})
export class SchedulingTemplategroupModule {}
