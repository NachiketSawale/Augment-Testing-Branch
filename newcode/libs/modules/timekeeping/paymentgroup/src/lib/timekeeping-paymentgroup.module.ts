/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { FormsModule } from '@angular/forms';
import { UiCommonModule } from '@libs/ui/common';
import { ContainerModuleRoute} from '@libs/ui/container-system';
import { TimekeepingPaymentgroupModuleInfo } from './model/timekeeping-paymentgroup-module-info.class';
import { RouterModule, Routes } from '@angular/router';
import { TIMEKEEPING_PAYMENT_GROUP_DATA_TOKEN, TimekeepingPaymentGroupDataService } from './services/timekeeping-payment-group-data.service';
import { TIMEKEEPING_PAYMENT_GROUP_BEHAVIOR_TOKEN, TimekeepingPaymentGroupBehavior } from './behaviors/timekeeping-payment-group-behavior.service';
import { TIMEKEEPING_PAYMENT_GROUP_RATE_BEHAVIOR_TOKEN, TimekeepingPaymentGroupRateBehavior } from './behaviors/timekeeping-payment-group-rate-behavior.service';
import { TIMEKEEPING_PAYMENT_GROUP_SURCHARGE_BEHAVIOR_TOKEN, TimekeepingPaymentGroupSurchargeBehavior } from './behaviors/timekeeping-payment-group-surcharge-behavior.service';

/**
 * Adds a default route to render containers to timekeeping paymentgroup module
 */
const routes: Routes = [
	new ContainerModuleRoute(TimekeepingPaymentgroupModuleInfo.instance)
];

/**
 * timekeeping paymentgroup module
 */
@NgModule({
	imports: [CommonModule, NgxGraphModule, FormsModule, UiCommonModule, RouterModule.forChild(routes)],
	declarations: [
],
	providers: [
		{ provide: TIMEKEEPING_PAYMENT_GROUP_DATA_TOKEN, useExisting: TimekeepingPaymentGroupDataService },
		{ provide: TIMEKEEPING_PAYMENT_GROUP_BEHAVIOR_TOKEN, useExisting: TimekeepingPaymentGroupBehavior },
		{ provide: TIMEKEEPING_PAYMENT_GROUP_RATE_BEHAVIOR_TOKEN, useExisting: TimekeepingPaymentGroupRateBehavior },
		{ provide: TIMEKEEPING_PAYMENT_GROUP_SURCHARGE_BEHAVIOR_TOKEN, useExisting: TimekeepingPaymentGroupSurchargeBehavior },
	]
})
export class TimekeepingPaymentGroupModule {

}
