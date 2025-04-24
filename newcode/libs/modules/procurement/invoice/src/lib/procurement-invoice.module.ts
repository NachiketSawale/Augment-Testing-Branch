/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProcurementInvoiceModuleInfo } from './model/procurement-invoice-module-info.class';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';
import { ImportInvoiceWarningComponent } from './components/import-invoice-warning/import-invoice-warning.component';
import { BasicsSharedModule } from '@libs/basics/shared';
import { ProcurementInvoiceReconciliation2Component } from './components/procurement-invoice-reconciliation2/procurement-invoice-reconciliation2.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementInvoiceModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule, GridComponent, BasicsSharedModule],
	providers: [],
	declarations: [ImportInvoiceWarningComponent, ProcurementInvoiceReconciliation2Component]
})
export class ProcurementInvoiceModule {}
