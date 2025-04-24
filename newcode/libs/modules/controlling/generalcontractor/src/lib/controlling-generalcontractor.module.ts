/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {UiCommonModule} from '@libs/ui/common';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ControllingGeneralContractorModuleInfo } from './model/controlling-generalcontractor-module-info.class';
import { CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_DATA_TOKEN, ControllingGeneralContractorCostHeaderDataService } from './services/controlling-general-contractor-cost-header-data.service';
import { CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_BEHAVIOR_TOKEN, ControllingGeneralContractorCostHeaderBehavior } from './behaviors/controlling-general-contractor-cost-header-behavior.service';

import { CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_DATA_TOKEN, ControllingGeneralContractorPesHeaderDataService } from './services/controlling-general-contractor-pes-header-data.service';
import { CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_BEHAVIOR_TOKEN, ControllingGeneralContractorPesHeaderBehavior } from './behaviors/controlling-general-contractor-pes-header-behavior.service';

import { CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_BEHAVIOR_TOKEN, ControllingGeneralContractorAddExpensesBehavior } from './behaviors/controlling-general-contractor-add-expenses-behavior.service';
import { CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_DATA_TOKEN, ControllingGeneralContractorAddExpensesDataService } from './services/controlling-general-contractor-add-expenses-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_BEHAVIOR_TOKEN, ControllingGeneralContractorActualsBehaviorService
} from './behaviors/controlling-general-contractor-actuals-behavior.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_DATA_TOKEN, ControllingGeneralContractorActualsDataService
} from './services/controlling-general-contractor-actuals-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_BEHAVIOR_TOKEN, ControllingGeneralContractorPackagesBehaviorService
} from './behaviors/controlling-general-contractor-packages-behavior.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_DATA_TOKEN, ControllingGeneralContractorPackagesDataService
} from './services/controlling-general-contractor-packages-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_DATA_TOKEN, ControllingGeneralContractorLineItemsDataService
} from './services/controlling-general-contractor-line-items-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_BEHAVIOR_TOKEN, ControllingGeneralContractorLineItemsBehaviorService
} from './behaviors/controlling-general-contractor-line-items-behavior.service';

import {CONTROLLING_GENERAL_CONTRACTOR_BUDGET_SHIFT_BEHAVIOR_TOKEN,ControllingGeneralContractorBudgetShiftBehavior} from './behaviors/controlling-general-contractor-budget-shift-behavior.service';
import {CONTROLLING_GENERAL_CONTRACTOR_Budget_Shift_EXPENSES_DATA_TOKEN,ControllingGeneralContractorBudgetShiftDataService} from './services/controlling-general-contractor-budget-shift-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_BEHAVIOR_TOKEN, ControllingGeneralContractorSalesContractsBehavior
} from './behaviors/controlling-general-contractor-sales-contracts-behavior.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_DATA_TOKEN, ControllingGeneralContractorSalesContractsDataService
} from './services/controlling-general-contractor-sales-contracts-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_DATA_TOKEN, ControllingGeneralContractorPrcInvoicesDataService
} from './services/controlling-general-contractor-prc-invoices-data.service';

import {
	CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_BEHAVIOR_TOKEN, ControllingGeneralContractorPrcInvoicesBehavior
} from './behaviors/controlling-general-contractor-prc-invoices-behavior.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_DATA_TOKEN, ControllingGeneralContractorPrcContractsDataService
} from './services/controlling-general-contractor-prc-contracts-data.service';
import {
	CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_BEHAVIOR_TOKEN,
	ControllingGeneralContractorPrcContractsBehaviorService
} from './behaviors/controlling-general-contractor-prc-contracts-behavior.service';

const routes: Routes = [new BusinessModuleRoute(ControllingGeneralContractorModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_DATA_TOKEN, useExisting: ControllingGeneralContractorCostHeaderDataService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorCostHeaderBehavior},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_DATA_TOKEN, useExisting: ControllingGeneralContractorPesHeaderDataService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorPesHeaderBehavior},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_DATA_TOKEN, useExisting: ControllingGeneralContractorAddExpensesDataService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorAddExpensesBehavior},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_DATA_TOKEN, useExisting: ControllingGeneralContractorActualsDataService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorActualsBehaviorService},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorPackagesBehaviorService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_DATA_TOKEN, useExisting: ControllingGeneralContractorPackagesDataService},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorPrcContractsBehaviorService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_DATA_TOKEN, useExisting: ControllingGeneralContractorPrcContractsDataService},


		{provide: CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_DATA_TOKEN, useExisting: ControllingGeneralContractorLineItemsDataService},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorLineItemsBehaviorService},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_BUDGET_SHIFT_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorBudgetShiftBehavior},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_Budget_Shift_EXPENSES_DATA_TOKEN, useExisting: ControllingGeneralContractorBudgetShiftDataService},

		{provide: CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_BEHAVIOR_TOKEN, useExisting: ControllingGeneralContractorSalesContractsBehavior},
		{provide: CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_DATA_TOKEN, useExisting: ControllingGeneralContractorSalesContractsDataService},

		{provide:CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_DATA_TOKEN,useExisting:ControllingGeneralContractorPrcInvoicesDataService},
		{provide:CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_BEHAVIOR_TOKEN,useExisting:ControllingGeneralContractorPrcInvoicesBehavior}
	],
})
export class ControllingGeneralcontractorModule {}
