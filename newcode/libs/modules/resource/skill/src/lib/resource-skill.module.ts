/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ResourceSkillModuleInfo } from './model/resource-skill-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';

const routes: Routes = [new BusinessModuleRoute(new ResourceSkillModuleInfo())];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: []
})
export class ResourceSkillModule {}