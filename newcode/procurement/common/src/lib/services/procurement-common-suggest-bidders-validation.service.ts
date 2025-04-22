/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonSuggestBiddersDataService } from './procurement-common-suggest-bidders-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { inject } from '@angular/core';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { set } from 'lodash';

/**
 * Procurement common total validation service
 */
export abstract class ProcurementCommonSuggestBiddersValidationService<T extends IPrcSuggestedBidderEntity,  PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	protected abstract checkUniqueTotalTypeRoute: string;

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonSuggestBiddersDataService<T, PT, PU>) {
		super();
	}

	private readonly bpValidator = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService
	});

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			CountryFk: this.validateCountryFk,
			Street: this.validateCountry,
			City: this.validateCountry,
			Zipcode: this.validateCountry,
			Telephone: this.validateCountry,
			BpName1: this.validateCountry
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected validateBusinessPartnerFk(info: ValidationInfo<T>) {
		// TODO: To be migrated.
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		return this.validateIsUnique(info);
	}

	protected validateCountryFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value === null ? 0 : info.value as number;

		if (value || entity.Street || entity.City || entity.Zipcode || entity.Telephone) {
			return this.validateIsMandatory(info);
		} else {
			return new ValidationResult();
		}
	}

	protected validateCountry(info: ValidationInfo<T>) {
		return this.validateCountryFk(info);
	}

	protected validateSubsidiaryFk(info: ValidationInfo<IPrcSuggestedBidderEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value;
		if (entity && entity.SubsidiaryFk !== value) {
			set(entity, 'SubsidiaryFk', value);
		}
		return { apply: true, valid: true };
	}
}