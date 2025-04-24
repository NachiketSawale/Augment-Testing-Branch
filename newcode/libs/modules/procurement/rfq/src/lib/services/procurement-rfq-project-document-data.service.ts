/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService } from '@libs/documents/shared';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
//Todo: We required "ProcurementRfqDocumentProjectDataService" service for ProcurementRfqChangeProjectDocumentRubricCategoryWizardService wizard so that I created but actual functionality is pending.
@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqDocumentProjectDataService extends DocumentProjectDataRootService<IRfqHeaderEntity> {
	protected readonly parentService: ProcurementRfqHeaderMainDataService;
	public constructor() {
		const parentDataService = inject(ProcurementRfqHeaderMainDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}
}