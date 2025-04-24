/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactModuleInfo } from './model/contact-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import {
	ContactAssignmentActivationDialogComponent
} from './components/assignment-activation-dialog/assignment-activation-dialog.component';
import {GridComponent} from '@libs/ui/common';

const routes: Routes = [
	new BusinessModuleRoute(ContactModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), GridComponent],
	declarations: [ContactAssignmentActivationDialogComponent]
})
export class BusinesspartnerContactModule {}
