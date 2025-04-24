/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsMeetingDocumentDataService } from '../basics-meeting-document-data.service';
import { DocumentDataValidationService } from '@libs/documents/shared';
import { IMtgDocumentEntity } from '@libs/basics/interfaces';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';

/**
 * Basics meeting document validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingDocumentValidationService extends DocumentDataValidationService<IMtgDocumentEntity> {
	protected constructor(dataService: BasicsMeetingDocumentDataService) {
		super(dataService);
	}

	/**
	 * Verify document OriginFileName.
	 * @protected
	 */
	protected override validateOriginFileName(info: ValidationInfo<IMtgDocumentEntity>): ValidationResult {
		const result = super.validateOriginFileName(info);
		if (result.valid) {
			const entity = info.entity;
			entity.Description = entity.OriginFileName;
		}
		return result;
	}
}
