/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ResourceWotModuleInfo } from './model/resource-wot-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';

const routes: Routes = [new BusinessModuleRoute(new ResourceWotModuleInfo())];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: []
})
export class ResourceWotModule {}