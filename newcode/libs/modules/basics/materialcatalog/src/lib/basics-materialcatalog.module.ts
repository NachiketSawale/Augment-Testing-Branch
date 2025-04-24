/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule} from '@angular/forms';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsMaterialcatalogModuleInfo } from './model/basics-materialcatalog-module-info.class';

const routes: Routes = [new ContainerModuleRoute(BasicsMaterialcatalogModuleInfo.instance)];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule],
	declarations: [],
	providers: [],
})
export class BasicsMaterialcatalogModule {}
