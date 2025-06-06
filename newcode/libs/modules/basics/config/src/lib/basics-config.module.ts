/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { BasicsConfigModuleInfo } from './model/basics-config-module-info.class';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(BasicsConfigModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: []

})
export class BasicsConfigModule { }
