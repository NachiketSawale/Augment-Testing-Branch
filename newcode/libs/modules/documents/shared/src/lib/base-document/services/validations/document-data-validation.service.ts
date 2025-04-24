/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { DocumentDataLeafService } from '../document-data-leaf.service';

/**
 * Document data validation service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentDataValidationService<T extends IDocumentBaseEntity> extends BaseValidationService<T> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	/**
	 * The constructor
	 * @param dataService data service
	 */
	public constructor(protected dataService: DocumentDataLeafService<T, IEntityIdentification, CompleteIdentification<IEntityIdentification>>) {
		super();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			OriginFileName: this.validateOriginFileName,
		};
	}

	/**
	 * Verify document OriginFileName.
	 * @protected
	 */
	protected validateOriginFileName(info: ValidationInfo<T>): ValidationResult {
		return this.validateIsMandatory(info);
	}
}
