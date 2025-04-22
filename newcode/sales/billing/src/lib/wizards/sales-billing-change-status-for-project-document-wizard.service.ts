/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DocumentsSharedChangeProjectDocumentStatusWizardService } from '@libs/documents/shared';
import { IInitializationContext } from '@libs/platform/common';
import { SalesBillingDocumentProjectDataService } from '../services/sales-billing-document-project-data.service';

@Injectable({
	providedIn: 'root',
})
/**
 * Sales Billing Change Status For Project Document Wizard Service
 */
export class SalesBillingChangeStatusForProjectDocumentWizardService extends DocumentsSharedChangeProjectDocumentStatusWizardService {
	protected override dataService = inject(SalesBillingDocumentProjectDataService);
	public static execute(context: IInitializationContext): void {
		context.injector.get(SalesBillingChangeStatusForProjectDocumentWizardService).onStartChangeStatusWizard();
	}
}
