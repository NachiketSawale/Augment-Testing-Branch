/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProcurementRequisitionModuleInfo } from './model/procurement-requisition-module-info.class';
import { PROCUREMENT_REQUISITION_TOTAL_BEHAVIOR_TOKEN, RequisitionTotalBehavior } from './behaviors/requisition-total-behavior.service';
import { SelectBoqVariantDialogComponent } from './components/select-boq-variant-dialog/select-boq-variant-dialog.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { SelectItemVariantDialogComponent } from './components/select-item-variant-dialog/select-item-variant-dialog.component';
import { ProcurementCommonModule } from '@libs/procurement/common';
import { PROCUREMENT_REQUISITION_PRICE_CONDITION_DATA_TOKEN, RequisitionPriceConditionDataService } from './services/requisition-price-condition-data.service';
import { PROCUREMENT_REQUISITION_PRICE_CONDITION_PARAM_DATA_TOKEN, RequisitionPriceConditionParamDataService } from './services/requisition-price-condition-param-data.service';

const routes: Routes = [new BusinessModuleRoute(ProcurementRequisitionModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, ProcurementCommonModule, PlatformCommonModule, GridComponent],
	declarations: [SelectBoqVariantDialogComponent, SelectItemVariantDialogComponent],
	providers: [
		{ provide: PROCUREMENT_REQUISITION_TOTAL_BEHAVIOR_TOKEN, useExisting: RequisitionTotalBehavior },
		{ provide: PROCUREMENT_REQUISITION_PRICE_CONDITION_DATA_TOKEN, useExisting: RequisitionPriceConditionDataService },
		{ provide: PROCUREMENT_REQUISITION_PRICE_CONDITION_PARAM_DATA_TOKEN, useExisting: RequisitionPriceConditionParamDataService },
	],
})
export class ProcurementRequisitionModule {}
