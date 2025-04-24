/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { ProcurementContractModuleInfo } from './model/procurement-contract-module-info.class';
import { UiCommonModule } from '@libs/ui/common';
import { ProcurementContractHeaderDataService, PROCUREMENT_CONTRACTHEADER_DATA_TOKEN } from './services/procurement-contract-header-data.service';
import { PROCUREMENT_CONTRACT_HEADER_BEHAVIOR_TOKEN, ProcurementContractHeaderBehavior } from './behaviors/procurement-contract-header-behavior.service';
import { ProcurementContractTotalDataService, PROCUREMENT_CONTRACTTOTAL_DATA_TOKEN } from './services/procurement-contract-total-data.service';
import { PROCUREMENT_CONTRACT_TOTAL_BEHAVIOR_TOKEN, ProcurementContractTotalBehavior } from './behaviors/procurement-contract-total-behavior.service';
import { PROCUREMENT_CONTRACT_ITEM_DATA_TOKEN, ProcurementContractItemDataService } from './services/procurement-contract-item-data.service';
import { PROCUREMENT_CONTRACT_ITEM_BEHAVIOR_TOKEN, ProcurementContractItemBehavior } from './behaviors/procurement-contract-item-behavior.service';
import { PROCUREMENT_CONTRACT_STRUCTURE_BEHAVIOR_TOKEN, ProcurementContractStructureBehavior } from './behaviors/procurement-contract-structure-behavior.service';
import { PROCUREMENT_CONTRACT_ITEM_VALIDATION_TOKEN, ProcurementContractItemValidationService } from './services/procurement-contract-item-validation.service';
import { PROCUREMENT_CONTRACT_PRICE_CONDITION_DATA_TOKEN, ProcurementContractPriceConditionDataService } from './services/procurement-contract-price-condition-data.service';
import { PROCUREMENT_CONTRACT_ITEM_INFO_BL_DATA_TOKEN, ProcurementContractItemInfoBlDataService } from './services/procurement-contract-item-info-bl-data.service';
import { PROCUREMENT_CONTRACT_MILE_STONE_DATA_TOKEN, ProcurementContractMileStoneDataService } from './services/procurement-contract-mile-stone-data.service';
import { ProcurementCommonModule } from '@libs/procurement/common';
import { PROCUREMENT_CONTRACT_OVERVIEW_DATA_TOKEN, ProcurementContractOverviewDataService } from './services/procurement-contract-overview-data.service';
import { PROCUREMENT_CONTRACT_DELIVERY_SCHEDULE_DATA_TOKEN, ProcurementContractDeliveryScheduleDataService } from './services/procurement-contract-deliveryschedule-data.service';
import { PROCUREMENT_CONTRACT_POST_CON_HISTORY_DATA_TOKEN, ProcurementContractPostConHistoryDataService } from './services/procurement-contract-postcon-history-data.service';
import { PROCUREMENT_CONTRACT_POST_CON_HISTORY_BEHAVIOR_TOKEN, ProcurementContractPostConHistoryBehavior } from './behaviors/procurement-contract-postcon-history-behavior.service';
import { PROCUREMENT_CONTRACT_EVENTS_DATA_TOKEN, ProcurementContractEventsDataService } from './services/procurement-contract-events-data.service';
import { PROCUREMENT_CONTRACT_TRANSACTION_BEHAVIOR_TOKEN, ProcurementContractTransactionBehavior } from './behaviors/procurement-contract-transaction-behavior.service';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN, ProcurementContractPaymentScheduleDataService } from './services/procurement-contract-payment-schedule-data.service';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN, ProcurementContractPaymentScheduleBehaviorService } from './behaviors/procurement-contract-payment-schedule-behavior.service';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_VALIDATION_TOKEN, ProcurementContractPaymentScheduleValidationService } from './services/procurement-contract-payment-schedule-validation.service';
import { PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_BEHAVIOR_TOKEN, ProcurementContractActualCertificateBehaviorService } from './behaviors/procurement-contract-actual-certificate-behavior.service';
import { PROCUREMENT_CONTRACT_CALL_OFFS_BEHAVIOR_TOKEN, ProcurementContractCallOffsBehavior } from './behaviors/procurement-contract-call-offs-behavior.service';

import { PROCUREMENT_CONTRACT_PROJECT_CHANGE_BEHAVIOR_TOKEN, ProcurementContractProjectChangeBehavior } from './behaviors/procurement-contract-project-change-behavior.service';
import { PROCUREMENT_CONTRACT_PRICE_CONDITION_PARAM_DATA_TOKEN, ProcurementContractPriceConditionParamDataService } from './services/procurement-contract-price-condition-param-data.service';
import { BoqSplitQuantityDataService } from '@libs/boq/main';
import { ProcurementContractBoqItemDataService } from './services/procurement-contract-boq-item-data.service';

const routes: Routes = [new ContainerModuleRoute(ProcurementContractModuleInfo.instance)];

/**
 * Contract module configuration
 */
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, ProcurementCommonModule],
	providers: [
		{ provide: PROCUREMENT_CONTRACTHEADER_DATA_TOKEN, useExisting: ProcurementContractHeaderDataService },
		{ provide: PROCUREMENT_CONTRACT_HEADER_BEHAVIOR_TOKEN, useExisting: ProcurementContractHeaderBehavior },
		{ provide: PROCUREMENT_CONTRACTTOTAL_DATA_TOKEN, useExisting: ProcurementContractTotalDataService },
		{ provide: PROCUREMENT_CONTRACT_TOTAL_BEHAVIOR_TOKEN, useExisting: ProcurementContractTotalBehavior },
		{ provide: PROCUREMENT_CONTRACT_ITEM_DATA_TOKEN, useExisting: ProcurementContractItemDataService },
		{ provide: PROCUREMENT_CONTRACT_ITEM_BEHAVIOR_TOKEN, useExisting: ProcurementContractItemBehavior },
		{ provide: PROCUREMENT_CONTRACT_ITEM_VALIDATION_TOKEN, useExisting: ProcurementContractItemValidationService },
		{ provide: PROCUREMENT_CONTRACT_STRUCTURE_BEHAVIOR_TOKEN, useExisting: ProcurementContractStructureBehavior },
		{ provide: PROCUREMENT_CONTRACT_PRICE_CONDITION_DATA_TOKEN, useExisting: ProcurementContractPriceConditionDataService },
		{ provide: PROCUREMENT_CONTRACT_PRICE_CONDITION_PARAM_DATA_TOKEN, useExisting: ProcurementContractPriceConditionParamDataService },
		{ provide: PROCUREMENT_CONTRACT_ITEM_INFO_BL_DATA_TOKEN, useExisting: ProcurementContractItemInfoBlDataService },
		{ provide: PROCUREMENT_CONTRACT_MILE_STONE_DATA_TOKEN, useExisting: ProcurementContractMileStoneDataService },
		{ provide: PROCUREMENT_CONTRACT_OVERVIEW_DATA_TOKEN, useExisting: ProcurementContractOverviewDataService },
		{ provide: PROCUREMENT_CONTRACT_DELIVERY_SCHEDULE_DATA_TOKEN, useExisting: ProcurementContractDeliveryScheduleDataService },
		{ provide: PROCUREMENT_CONTRACT_OVERVIEW_DATA_TOKEN, useExisting: ProcurementContractOverviewDataService },
		{ provide: PROCUREMENT_CONTRACT_POST_CON_HISTORY_DATA_TOKEN, useExisting: ProcurementContractPostConHistoryDataService },
		{ provide: PROCUREMENT_CONTRACT_POST_CON_HISTORY_BEHAVIOR_TOKEN, useExisting: ProcurementContractPostConHistoryBehavior },
		{ provide: PROCUREMENT_CONTRACT_EVENTS_DATA_TOKEN, useExisting: ProcurementContractEventsDataService },
		{ provide: PROCUREMENT_CONTRACT_TRANSACTION_BEHAVIOR_TOKEN, useExisting: ProcurementContractTransactionBehavior },
		{ provide: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN, useExisting: ProcurementContractPaymentScheduleDataService },
		{ provide: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN, useExisting: ProcurementContractPaymentScheduleBehaviorService },
		{ provide: PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_VALIDATION_TOKEN, useExisting: ProcurementContractPaymentScheduleValidationService },
		{ provide: PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_BEHAVIOR_TOKEN, useExisting: ProcurementContractActualCertificateBehaviorService },
		{ provide: PROCUREMENT_CONTRACT_PROJECT_CHANGE_BEHAVIOR_TOKEN, useExisting: ProcurementContractProjectChangeBehavior },
		{ provide: PROCUREMENT_CONTRACT_CALL_OFFS_BEHAVIOR_TOKEN, useExisting: ProcurementContractCallOffsBehavior },
		{ provide: BoqSplitQuantityDataService, useFactory: () => new BoqSplitQuantityDataService(inject(ProcurementContractBoqItemDataService)) }
	],
})
export class ProcurementContractModule {}
