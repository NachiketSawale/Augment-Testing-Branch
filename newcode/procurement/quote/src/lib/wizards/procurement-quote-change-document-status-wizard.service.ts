/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';

import { ICommonWizard,ProcurementCommonChangeDocumentStatusWizardService } from '@libs/procurement/common';
import { ProcurementQuoteDocumentDataService } from '../services/procurement-quote-document-data.service';

/**
 *  Change docuement Status Wizard Service for the Procurement Quote.
 */
@Injectable({
	providedIn: 'root',
})

export class ProcurementQuoteChangeDocumentStatusWizardService extends ProcurementCommonChangeDocumentStatusWizardService implements ICommonWizard {

	protected override dataService = inject(ProcurementQuoteDocumentDataService);

	public async execute(context: IInitializationContext): Promise<void> {
		await this.startChangeStatusWizard();
	}
}
