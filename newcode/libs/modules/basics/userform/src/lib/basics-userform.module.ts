/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsUserformModuleInfo } from './model/basics-userform-module-info.class';

const routes: Routes = [
	new ContainerModuleRoute(BasicsUserformModuleInfo.instance)
];

/**
 * Represents the module to manage user form.
 */
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class BasicsUserformModule {
}
