/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsTaxCodeModuleInfo } from './model/basics-tax-code-module-info.class';

const routes: Routes = [new ContainerModuleRoute(BasicsTaxCodeModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class BasicsTaxCodeModule {}
