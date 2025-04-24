/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { QtoMainModuleInfo } from './model/qto-main-module-info.class';
import { ExportQtoDocumentComponent } from './components/export/export-qto-document/export-qto-document.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';

const routes: Routes = [new ContainerModuleRoute(QtoMainModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, FormsModule, GridComponent],
	declarations: [ExportQtoDocumentComponent],
})
export class ModulesQtoMainModule {}
