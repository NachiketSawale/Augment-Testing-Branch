/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DocumentDataValidationService } from '@libs/documents/shared';
import { HsqeChecklistDocumentDataService } from '../hsqe-checklist-document-data.service';
import { IHsqCheckListDocumentEntity } from '@libs/hsqe/interfaces';

/**
 * CheckList document validation service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistDocumentValidationService extends DocumentDataValidationService<IHsqCheckListDocumentEntity> {
	protected constructor(dataService: HsqeChecklistDocumentDataService) {
		super(dataService);
	}
}
