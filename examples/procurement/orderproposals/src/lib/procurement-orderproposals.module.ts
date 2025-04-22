/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProcurementOrderproposalsModuleInfo } from './model/procurement-orderproposals-module-info.class';
import { CreateContractRequisitionDialogComponent } from './components/create-contract-requisition-dialog.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementOrderproposalsModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule,FormsModule],
	providers: [],
	declarations:[CreateContractRequisitionDialogComponent]
})
export class ProcurementOrderproposalsModule {}
