/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { Rubric } from '@libs/basics/shared';
import { IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';


@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IInvHeaderEntity, InvComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'procurement.invoice.moduleName',
			moduleInternalName: ProcurementInternalModule.Invoice,
			rootDataService: inject(ProcurementInvoiceHeaderDataService),
			getConfigurationFK: (entity) => entity.PrcConfigurationFk,
			getBillingSchemaFk: (entity) => entity.BillingSchemaFk,
			isUpdateHeaderTexts: false,
			showBillingSchema: true,
			rubricFk: Rubric.Invoices
		});
	}

}