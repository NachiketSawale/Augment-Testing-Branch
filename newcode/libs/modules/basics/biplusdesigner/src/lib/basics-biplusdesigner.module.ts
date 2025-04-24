/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsBiPlusDesignerImportDialogComponent } from './biplusdesignerdashboard/components/basics-biplusdesigner-import-dialog/basics-biplusdesigner-import-dialog.component';
import { PlatformCommonModule, TranslatePipe } from '@libs/platform/common';
import { BasicsBiplusdesignerModuleInfo } from './model/basics-biplusdesigner-module-info.class';

const routes: Routes = [new BusinessModuleRoute(BasicsBiplusdesignerModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule],
	declarations: [BasicsBiPlusDesignerImportDialogComponent],
	providers: [TranslatePipe],
})
export class BasicsBiplusdesignerModule {}
