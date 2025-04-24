/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsCountryEntity } from '../model/basics-country-entity.class';
import { inject, InjectionToken } from '@angular/core';
import { BASICS_COUNTRY_DATA_TOKEN, BasicsCountryDataService } from './basics-country-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';



export const BASICS_COUNTRY_VALIDATION_TOKEN = new InjectionToken<BasicsCountryValidationService>('basicsCountryValidationToken');

export class BasicsCountryValidationService extends BaseValidationService<BasicsCountryEntity> {
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	protected translateService = inject(PlatformTranslateService);
	private basicsCountryDataService = inject(BasicsCountryDataService);
	private readonly countryValidators: IValidationFunctions<BasicsCountryEntity> = {
		IsDefault: this.validateIsDefault,
		RegexVatno: this.validateRegexVatnoAsync,
		RegexTaxno: this.validateRegexTaxno,
		VatNoValidExample: this.validateVatNoValidExampleAsync,
		TaxNoValidExample: this.validateTaxNoValidExampleAsync
	};

	protected generateValidationFunctions(): IValidationFunctions<BasicsCountryEntity> {
		return this.countryValidators;
	}

	private validateIsDefault(info: ValidationInfo<BasicsCountryEntity>): ValidationResult {
		if (info.value) {
			this.basicsCountryDataService.getList().filter((countryList) => countryList.IsDefault === true)
				.forEach(function (item) {
					item.IsDefault = false;
				});
			this.basicsCountryDataService.setModified(info.entity);
		}

		return new ValidationResult();
	}

	private async validateRegexVatnoAsync(info: ValidationInfo<BasicsCountryEntity>): Promise<ValidationResult> {
		const response = await lastValueFrom(this.http.get<boolean>(this.config.webApiBaseUrl + 'basics/country/validateCheckRegex?checkRegex=' + info.value));

		info.entity.VatNoValidExample = '';
		this.validateVatNoValidExampleAsync({entity: info.entity, value: info.entity.VatNoValidExample, field: 'VatNoValidExample'});

		const result= new ValidationResult();

		if(response) {
			result.apply = true;
		} else {
			result.apply = false;
			result.valid = false;
			result.error = 'basics.company.validation.noValidRegEx';
		}

		return result;
	}

	private validateRegexTaxno(info: ValidationInfo<BasicsCountryEntity>): ValidationResult {
		info.entity.TaxNoValidExample = '';
		this.validateTaxNoValidExampleAsync(new ValidationInfo<BasicsCountryEntity>(info.entity, info.entity.TaxNoValidExample, 'TaxNoValidExample'));
		return new ValidationResult();
	}

	private async validateVatNoValidExampleAsync(info: ValidationInfo<BasicsCountryEntity>): Promise<ValidationResult> {
		if (!info.value || !info.entity.RegexVatno) {
			return Promise.resolve(new ValidationResult());
		}

		const response = await lastValueFrom(this.http.get<boolean>(this.config.webApiBaseUrl + 'basics/country/validatevalidexample?pattern=' + info.entity.RegexVatno + '&source=' + info.value));
		const result= new ValidationResult();

		if(response) {
			result.apply = true;
		} else {
			result.apply = false;
			result.valid = false;
			result.error = this.translateService.instant('basics.country.validation.invalidExample', {
				example: this.translateService.instant('basics.country.entityVatNoValidExample'),
				regex: this.translateService.instant('basics.country.entityRegexVatno')
			}).text;
		}

		return result;
	}

	private async validateTaxNoValidExampleAsync(info: ValidationInfo<BasicsCountryEntity>): Promise<ValidationResult> {
		if (!info.value || !info.entity.RegexTaxno) {
			return Promise.resolve(new ValidationResult());
		}

		const response = await lastValueFrom(this.http.get<boolean>(this.config.webApiBaseUrl + 'basics/country/validatevalidexample?pattern=' + info.entity.RegexTaxno + '&source=' + info.value));

		const result= new ValidationResult();

		if(response) {
			result.apply = true;
		} else {
			result.apply = false;
			result.valid = false;
			result.error = this.translateService.instant('basics.country.validation.invalidExample', {
				example: this.translateService.instant('basics.country.entityTaxNoValidExample'),
				regex: this.translateService.instant('basics.country.entityRegexTaxno')
			}).text;
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsCountryEntity> {
		return inject(BASICS_COUNTRY_DATA_TOKEN);
	}
}
