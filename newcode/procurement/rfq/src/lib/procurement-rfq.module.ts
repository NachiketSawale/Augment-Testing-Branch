/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProcurementRfqModuleInfo } from './model/procurement-rfq-module-info.class';
import { ProcurementRfqEmailFaxRecipientComponent } from './components/procurement-rfq-email-fax-recipient/procurement-rfq-email-fax-recipient.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { ProcurementRfqEmailFaxSenderComponent } from './components/procurement-rfq-email-fax-sender/procurement-rfq-email-fax-sender.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementRfqModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), PlatformCommonModule, FormsModule, GridComponent, UiCommonModule,],
	declarations:[ProcurementRfqEmailFaxRecipientComponent, ProcurementRfqEmailFaxSenderComponent],
	providers: [],
	
})
export class ProcurementRfqModule {
}
