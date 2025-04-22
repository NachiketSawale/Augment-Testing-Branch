/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProcurementPesModuleInfo } from './model/procurement-pes-module-info.class';
import { PROCUREMENT_PES_EVENTS_DATA_TOKEN, ProcurementPesEventsDataService } from './services/procurement-pes-events-data.service';
import { FormsModule } from '@angular/forms';
import { ProcurementPesCreateInvoiceWizardComponent } from './components/procurement-pes-create-invoice-wizard/procurement-pes-create-invoice-wizard.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { PROCUREMENT_PES_PRICE_CONDITION_DATA_TOKEN, ProcurementPesPriceConditionDataService } from './services/procurement-pes-price-condition-data.service';
import { PROCUREMENT_PES_PRICE_CONDITION_PARAM_DATA_TOKEN, ProcurementPesPriceConditionParamDataService } from './services/procurement-pes-price-condition-param-data.service';

const routes: Routes = [new BusinessModuleRoute(ProcurementPesModuleInfo.instance)];

@NgModule({
	declarations: [ProcurementPesCreateInvoiceWizardComponent],
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule],
	providers: [
		{ provide: PROCUREMENT_PES_EVENTS_DATA_TOKEN, useExisting: ProcurementPesEventsDataService },
		{ provide: PROCUREMENT_PES_PRICE_CONDITION_DATA_TOKEN, useExisting: ProcurementPesPriceConditionDataService },
		{ provide: PROCUREMENT_PES_PRICE_CONDITION_PARAM_DATA_TOKEN, useExisting: ProcurementPesPriceConditionParamDataService },
	],
})
export class ProcurementPesModule {}
