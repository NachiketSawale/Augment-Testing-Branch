/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { DocumentsCentralQueryModuleInfo } from './model/documents-centralquery-module-info.class';
import { DocumentsCentralqueryContextConfigOptionComponent } from './components/context-config/documents-centralquery-context-config-option.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { BasicsSharedModule } from '@libs/basics/shared';

const routes: Routes = [new ContainerModuleRoute(DocumentsCentralQueryModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, FormsModule, BasicsSharedModule],
	providers: [],
	declarations: [DocumentsCentralqueryContextConfigOptionComponent],
})
export class DocumentsCentralqueryModule {}
