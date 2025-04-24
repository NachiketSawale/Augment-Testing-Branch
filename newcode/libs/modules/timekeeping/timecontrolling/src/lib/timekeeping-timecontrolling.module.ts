/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { TimekeepingTimecontrollingModuleInfo } from './model/timekeeping-timecontrolling-module-info.class';

const routes: Routes = [new BusinessModuleRoute(TimekeepingTimecontrollingModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class TimekeepingTimecontrollingModule {}
