/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions
} from '@libs/platform/data-access';
import { BasicsCountryStateEntity } from '../model/basics-country-state-entity.class';
import { inject, InjectionToken } from '@angular/core';
import { BASICS_COUNTRY_STATE_DATA_TOKEN } from './basics-country-state-data.service';

export const BASICS_COUNTRY_STATE_VALIDATION_TOKEN = new InjectionToken<BasicsCountryStateValidationService>('basicsCountryStateValidationToken');

export class BasicsCountryStateValidationService extends BaseValidationService<BasicsCountryStateEntity> {
	private readonly countryStateValidators: IValidationFunctions<BasicsCountryStateEntity> = {
		State: this.validateIsMandatory
	};

	protected generateValidationFunctions(): IValidationFunctions<BasicsCountryStateEntity> {
		return this.countryStateValidators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsCountryStateEntity> {
		return inject(BASICS_COUNTRY_STATE_DATA_TOKEN);
	}
}