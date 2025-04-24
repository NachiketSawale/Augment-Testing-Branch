/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LazyInjectionToken } from '@libs/platform/common';
import { ILookupLayoutGenerator, GUARANTOR_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';
import { BusinessPartnerSearchBaseEntityGridService } from './business-partner-search-base-entity-grid.service';
import { IGuarantorEntity } from '@libs/businesspartner/interfaces';

/**
 * Service to get Grid Entity
 */

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerSearchGuarantorEntityGridService extends BusinessPartnerSearchBaseEntityGridService<IGuarantorEntity, IGuarantorEntity, NonNullable<unknown>> {


	public async generateGridConfig() {
		return await this.generateBaseGridConfig();
	}

	protected getLayoutGeneratorToken(): LazyInjectionToken<ILookupLayoutGenerator<object>> {
		return GUARANTOR_LOOKUP_LAYOUT_GENERATOR;
	}
}
