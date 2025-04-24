/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { UsermanagementRightModuleInfo } from './model/usermanagement-right-module-info.class';
import { UsermanagementRightSelectRightsDialogComponent } from './right/components/usermanagement-right-select-rights-dialog/usermanagement-right-select-rights-dialog.component';
import { UsermanagementRightBulkAssignDialogComponent } from './components/usermanagement-right-bulk-assign-dialog/usermanagement-right-bulk-assign-dialog.component';

const routes: Routes = [new BusinessModuleRoute(UsermanagementRightModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	declarations: [UsermanagementRightBulkAssignDialogComponent, UsermanagementRightSelectRightsDialogComponent],

	providers: [],
})
export class UsermanagementRightModule {}
