/*
 * Copyright(c) RIB Software GmbH
 */

import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { BasicsEfbSheetsModuleInfo } from './model/entities/basics-efbsheets-module-info.class';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new ContainerModuleRoute(BasicsEfbSheetsModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
})
export class ModulesBasicsEfbsheetsModule {}
