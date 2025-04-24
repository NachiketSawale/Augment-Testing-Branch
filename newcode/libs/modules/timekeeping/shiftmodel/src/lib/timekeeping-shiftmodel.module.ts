/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { TimekeepingShiftmodelModuleInfo } from './model/timekeeping-shiftmodel-module-info.class';

const routes: Routes = [new BusinessModuleRoute(TimekeepingShiftmodelModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

})
export class TimekeepingShiftmodelModule {}
