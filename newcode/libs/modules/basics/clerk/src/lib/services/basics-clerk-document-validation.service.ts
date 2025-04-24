/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IBasicsClerkDocumentEntity} from '@libs/basics/interfaces';
import { BasicsClerkDocumentDataService } from './basics-clerk-document-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsClerkDocumentValidationService extends BaseValidationService<IBasicsClerkDocumentEntity>{
	private basicsClerkDocumentDataService = inject(BasicsClerkDocumentDataService);
	protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkDocumentEntity> {
		return {
			ClerkDocumentTypeFk: this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkDocumentEntity> {
		return this.basicsClerkDocumentDataService;
	}
}