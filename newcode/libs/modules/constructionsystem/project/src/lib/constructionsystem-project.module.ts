/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ConstructionsystemProjectModuleInfo } from './model/constructionsystem-project-module-info.class';
import { CopyInstanceHeaderComponent } from './components/copy-instance-header/copy-instance-header.component';
import { PlatformCommonModule } from '@libs/platform/common';
import {
	CompareCosInstanceHeaderComponent
} from './components/compare-cos-instance-header/compare-cos-instance-header.component';
import { FormsModule } from '@angular/forms';
import { UpdateCosInstanceComponent } from './components/update-cos-instance/update-cos-instance.component';

const routes: Routes = [new BusinessModuleRoute(ConstructionsystemProjectModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, GridComponent, FormsModule],
	declarations: [UpdateCosInstanceComponent, CopyInstanceHeaderComponent, CompareCosInstanceHeaderComponent],
})
export class ConstructionsystemProjectModule {}
