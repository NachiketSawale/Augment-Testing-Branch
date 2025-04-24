/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ControllingStructureModuleInfo } from './model/controlling-structure-module-info.class';
import {GridComponent, UiCommonModule} from '@libs/ui/common';
import {
 ControllingStructureTransferSchedulerTaskComponent
} from './components/controlling-structure-transfer-scheduler-task/controlling-structure-transfer-scheduler-task.component';
import {PlatformCommonModule} from '@libs/platform/common';
import {
    ControllingStructureUpdateLineItemQuantityComponent
} from './components/controlling-structure-transfer-scheduler-task/update-line-item-quantity/update-line-item-quantity.component';
import {FormsModule} from '@angular/forms';
import {
    UpdateSalesRevenueComponent
} from './components/controlling-structure-transfer-scheduler-task/update-sales-revenue/update-sales-revenue.component';
import {ProjectComponent} from './components/controlling-structure-transfer-scheduler-task/project/project.component';

const routes: Routes = [new BusinessModuleRoute(ControllingStructureModuleInfo.instance)];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, GridComponent, FormsModule],
    declarations:[ControllingStructureTransferSchedulerTaskComponent,
        ControllingStructureUpdateLineItemQuantityComponent,
        UpdateSalesRevenueComponent,
        ProjectComponent],
    providers: []
,
})
export class ControllingStructureModule {}
