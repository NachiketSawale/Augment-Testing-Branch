/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { SalesContractModuleInfo } from './model/sales-contract-module-info.class';
import {SalesContractPaymentScheduleHeaderComponent} from './components/payment-schedule/payment-schedule-header.component';
import {
	SALES_CONTRACT_PAYMENT_SCHEDULE_LAYOUT_TOKEN,
	SalesContractPaymentScheduleLayoutService
} from './services/sales-contract-payment-schedule-layout.service';
import {PlatformCommonModule} from '@libs/platform/common';
import {
	SALES_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN,
	SalesContractPaymentScheduleDataService
} from './services/sales-contract-payment-schedule-data.service';
import {
	SALES_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN, SalesContractPaymentScheduleBehavior
} from './behaviors/sales-contract-payment-schedule-behavior.service';
import { SalesContractMaintainPaymentScheduleVersionComponent } from './components/maintain-payment-schedule-version/maintain-payment-schedule-version.component';
import { BoqSplitQuantityDataService } from '@libs/boq/main';
import { SalesContractBoqItemDataService } from './services/sales-contract-boq-item-data.service';

const routes: Routes = [new BusinessModuleRoute(SalesContractModuleInfo.instance)];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, FormsModule, GridComponent],
	exports: [SalesContractPaymentScheduleHeaderComponent],
	providers: [
		{ provide: SALES_CONTRACT_PAYMENT_SCHEDULE_LAYOUT_TOKEN, useExisting: SalesContractPaymentScheduleLayoutService },
		{ provide: SALES_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN, useExisting:  SalesContractPaymentScheduleDataService},
		{ provide: SALES_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN, useExisting: SalesContractPaymentScheduleBehavior},
		// Todo-BOQ: Currently we use this explicit approach of creating a BoqSplitQuantityDataService instance and hand over the fitting parent SalesContractBoqItemDataService.
		// Todo-BOQ: As suggested by Florian we could also try to model this depencendy via the feature registry (same as already done with the boq wizard services)
		// Todo-BOQ: and only use a service interface instead of the service class itself to decouple modules and enable lazy loading.
		{ provide: BoqSplitQuantityDataService, useFactory: () => new BoqSplitQuantityDataService(inject(SalesContractBoqItemDataService)) }
	],
	declarations: [SalesContractPaymentScheduleHeaderComponent, SalesContractMaintainPaymentScheduleVersionComponent],
})
export class SalesContractModule {}
