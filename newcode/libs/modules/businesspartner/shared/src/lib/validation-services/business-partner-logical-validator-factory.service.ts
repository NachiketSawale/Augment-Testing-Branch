/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, runInInjectionContext } from '@angular/core';
import { BusinessPartnerLogicalValidatorService } from './business-partner-logical-validator.service';
import { ServiceLocator } from '@libs/platform/common';
import { IBusinessPartner2ValidatorOptions } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})

export class BusinessPartnerLogicalValidatorFactoryService {
	public create<T extends object>(options: IBusinessPartner2ValidatorOptions<T>) {
		return runInInjectionContext(ServiceLocator.injector,
			() => new BusinessPartnerLogicalValidatorService<T>(options));
	}
}