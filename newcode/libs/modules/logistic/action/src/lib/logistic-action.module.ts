/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticActionModuleInfo } from './model/logistic-action-module-info.class';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ActionRecordsComponent } from './components/action-records/action-records.component';


const routes: Routes = [new BusinessModuleRoute(new LogisticActionModuleInfo())];
@NgModule({
	declarations: [ActionRecordsComponent],
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, GridComponent],
	providers: []
})
export class LogisticActionModule {}