/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProcurementPackageModuleInfo } from './model/procurement-package-module-info.class';
import { ProcurementPackageChangeDateDialogComponent } from './components/change-date-dialog/change-date-dialog.component';
import { ProcurementPackageImportDialogComponent } from './components/package-import-dialog/package-import-dialog.component';
import { ProcurementCommonModule } from '@libs/procurement/common';
import { ProcurementPackageCreateRequisitionComponent } from './components/create-requisition/create-requisition.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { ProcurementPackageUpdateDateDialogComponent } from './components/package-update-date/package-update-date-dialog.component';
import { ProcurementPackageImportD93DialogComponent } from './components/package-import-d93-dialog/package-import-d93-dialog.component';
import { ProcurementPackageImportResultDialogComponent } from './components/package-import-result-dialog/package-import-result-dialog.component';
import { PROCUREMENT_Package_PRICE_CONDITION_PARAM_DATA_TOKEN, ProcurementPackagePriceConditionParamDataService } from './services/procurement-package-price-condition-param-data.service';
import { PROCUREMENT_PACKAGE_PRICE_CONDITION_DATA_TOKEN, ProcurementPackagePriceConditionDataService } from './services/procurement-package-price-condition-data.service';
import { ProcurementPackageUpdateSchedulingDialogComponent } from './components/update-scheduling/update-scheduling-dialog.component';
import { ProcurementPackageBoqScopeReplacementDialogComponent } from './components/boq-scope-replacement-dialog/boq-scope-replacement-dialog.component';
import { ProcurementPackageRemarkContainerComponent } from './components/package-remark-container/package-remark-container.component';
import { ProcurementPackageCreatePackageFromTemplateDialogComponent } from './components/package-crate-package-from-template/package-create-package-from-template.component';
import { ItemScopeReplacementDialogComponent } from './components/item-scope-replacement-dialog/item-scope-replacement-dialog.component';
import { ProcurementPackageEvaluateEventsDialogComponent } from './components/package-evaluate-events/package-evaluate-events-dialog.component';

const routes: Routes = [new BusinessModuleRoute(ProcurementPackageModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, ProcurementCommonModule, PlatformCommonModule, GridComponent, FormsModule],
	declarations: [
		ItemScopeReplacementDialogComponent,
		ProcurementPackageChangeDateDialogComponent,
		ProcurementPackageImportDialogComponent,
		ProcurementPackageCreateRequisitionComponent,
		ProcurementPackageUpdateDateDialogComponent,
		ProcurementPackageImportD93DialogComponent,
		ProcurementPackageImportResultDialogComponent,
		ProcurementPackageUpdateSchedulingDialogComponent,
		ProcurementPackageBoqScopeReplacementDialogComponent,
		ProcurementPackageRemarkContainerComponent,
		ProcurementPackageCreatePackageFromTemplateDialogComponent,
		ProcurementPackageEvaluateEventsDialogComponent
	],
	providers: [
		{ provide: PROCUREMENT_PACKAGE_PRICE_CONDITION_DATA_TOKEN, useExisting: ProcurementPackagePriceConditionDataService },
		{ provide: PROCUREMENT_Package_PRICE_CONDITION_PARAM_DATA_TOKEN, useExisting: ProcurementPackagePriceConditionParamDataService },
	],
})
export class ProcurementPackageModule {}
