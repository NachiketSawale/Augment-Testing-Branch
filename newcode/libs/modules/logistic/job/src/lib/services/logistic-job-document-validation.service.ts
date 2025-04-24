/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IJobDocumentEntity } from '@libs/logistic/interfaces';
import { LogisticJobDocumentDataService } from './logistic-job-document-data.service';

/**
 * Logistic Job Document Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobDocumentValidationService extends BaseValidationService<IJobDocumentEntity> {


	private dataService = inject(LogisticJobDocumentDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IJobDocumentEntity> {
		return {
			DocumentTypeFk:this.validateIsMandatory,
			JobDocumentTypeFk:this.validateIsMandatory,
			FileArchiveDocFk:this.validateIsMandatory,
			JobFk:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IJobDocumentEntity> {
		return this.dataService;
	}


}