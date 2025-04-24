/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsMeetingModuleInfo } from './model/basics-meeting-module-info.class';
import { BASICS_MEETING_DATA_TOKEN, BasicsMeetingDataService } from './services/basics-meeting-data.service';
import { BASICS_MEETING_BEHAVIOR_TOKEN, BasicsMeetingBehavior } from './behaviors/basics-meeting-behavior.service';
import { BASICS_MEETING_ATTENDEE_DATA_TOKEN, BasicsMeetingAttendeeDataService } from './services/basics-meeting-attendee-data.service';

const routes: Routes = [new BusinessModuleRoute(BasicsMeetingModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: BASICS_MEETING_DATA_TOKEN, useExisting: BasicsMeetingDataService},
		{provide: BASICS_MEETING_BEHAVIOR_TOKEN, useExisting: BasicsMeetingBehavior},
		{provide: BASICS_MEETING_ATTENDEE_DATA_TOKEN, useExisting: BasicsMeetingAttendeeDataService},
	],
})
export class BasicsMeetingModule {}
