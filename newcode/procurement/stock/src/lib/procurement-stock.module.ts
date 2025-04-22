/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProcurementStockModuleInfo } from './model/procurement-stock-module-info.class';
import { StockReconciliation2GridComponent } from './components/stock-reconciliation/stock-reconciliation2-grid/stock-reconciliation2-grid.component';
import { BasicsSharedModule } from '@libs/basics/shared';
import { ProcurementStockTotalReconciliationComponent } from './components/total-reconciliation/total-reconciliation.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementStockModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, BasicsSharedModule],
	declarations:[StockReconciliation2GridComponent, ProcurementStockTotalReconciliationComponent],
	providers: [],
	exports: [StockReconciliation2GridComponent],
})
export class ProcurementStockModule {}
