/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UsermanagementGroupModuleInfo } from './model/usermanagement-group-module-info.class';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(UsermanagementGroupModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [ ], 
})
export class UsermanagementGroupModule {}
