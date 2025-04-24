/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';
import { BasicsCustomizeModuleInfo } from './model/basics-customize-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';


const routes: Routes = [new BusinessModuleRoute( BasicsCustomizeModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
})
export class BasicsCustomizeModule {}
