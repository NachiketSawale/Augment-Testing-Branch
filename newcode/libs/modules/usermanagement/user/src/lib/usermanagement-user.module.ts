/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UsermanagementUserModuleInfo } from './model/usermanagement-user-module-info.class';

const routes: Routes = [new BusinessModuleRoute(UsermanagementUserModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],

	providers: []
})
export class UsermanagementUserModule {
}
