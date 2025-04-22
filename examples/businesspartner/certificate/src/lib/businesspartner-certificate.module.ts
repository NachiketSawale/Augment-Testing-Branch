

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinesspartnerCertificateModuleInfo } from './model/businesspartner-certificate-module-info.class';
import {BusinessModuleRoute} from '@libs/ui/business-base';
import { BusinesspartnerCertificateEmailRecipientComponent } from './components/email-recipient/email-recipient.component';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { BusinesspartnerCertificateCreateRequestsDialogComponent } from './components/create-requests/create-requests-dialog.component';
import { BusinesspartnerCertificateCreateReminderDialogComponent } from './components/create-reminder/create-reminder-dialog.component';

const routes: Routes = [
	new BusinessModuleRoute(BusinesspartnerCertificateModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, GridComponent],
	declarations: [BusinesspartnerCertificateCreateRequestsDialogComponent, BusinesspartnerCertificateEmailRecipientComponent,BusinesspartnerCertificateCreateReminderDialogComponent]
})
export class BusinesspartnerCertificateModule {

}
