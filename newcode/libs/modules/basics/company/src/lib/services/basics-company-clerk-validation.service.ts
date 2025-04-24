/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICompany2ClerkEntity } from '@libs/basics/interfaces';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyClerkValidationService extends BaseValidationService<ICompany2ClerkEntity> {

	private basicsCompanyMainDataService = inject(BasicsCompanyMainDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICompany2ClerkEntity> {
		return {
			ClerkFk: this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICompany2ClerkEntity> {
		return this.basicsCompanyMainDataService;
	}

}