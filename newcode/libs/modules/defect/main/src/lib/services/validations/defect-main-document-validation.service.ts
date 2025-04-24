/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DocumentDataValidationService } from '@libs/documents/shared';
import { IDfmDocumentEntity } from '../../model/entities/dfm-document-entity.interface';
import { DefectMainDocumentDataService } from '../defect-main-document-data.service';

/**
 * Defect document validation service
 */
@Injectable({
	providedIn: 'root',
})
export class DefectMainDocumentValidationService extends DocumentDataValidationService<IDfmDocumentEntity> {
	protected constructor(dataService: DefectMainDocumentDataService) {
		super(dataService);
	}
}
