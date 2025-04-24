/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ICommonWizard,ProcurementCommonChangeDocumentStatusWizardService } from '@libs/procurement/common';
import { ProcurementRfqDocumentDataService } from '../services/procurement-rfq-document-data.service';

/**
 *  Change docuement Status Wizard Service for the Procurement Rfq.
 */
@Injectable({
	providedIn: 'root',
})

export class ProcurementRfqChangeDocumentStatusWizardService extends ProcurementCommonChangeDocumentStatusWizardService implements ICommonWizard {

	protected override dataService = inject(ProcurementRfqDocumentDataService);

	public async execute(context: IInitializationContext): Promise<void> {
		await this.startChangeStatusWizard();
	}
}
