/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PlatformTranslateService } from '@libs/platform/common';
import { BusinessPartnerBankDataService } from '../businesspartner-bank-data.service';
import IBAN from 'iban';
import { BasicsShareBankLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ILookupSearchRequest } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { isNumber } from 'lodash';
import { IsDefaultType } from '../../model/enums/is-default-type.enum';
import { IBusinessPartnerBankEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerBankValidationService extends BaseValidationService<IBusinessPartnerBankEntity> {
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly basicsShareBankLookupService = inject(BasicsShareBankLookupService);
	private readonly businessPartnerBankDataService: BusinessPartnerBankDataService = inject(BusinessPartnerBankDataService);
	private readonly bankLookupService = inject(BasicsShareBankLookupService);
	private readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	protected override generateValidationFunctions(): IValidationFunctions<IBusinessPartnerBankEntity> {
		return {
			Iban: this.asyncValidateIban,
			BankTypeFk: this.validateBankTypeFk,
			CountryFk: this.validateCountryFk,
			BankFk: this.validateBankFk,
			IsDefaultCustomer: this.validateIsDefaultCustomer,
			IsDefault: this.validateIsDefault,
			AccountNo: this.ValidateAccountNo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartnerBankEntity> {
		return this.businessPartnerBankDataService;
	}

	private generalRequiredValidator(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		if (!info.value || (isNumber(info.value) && info.value <= 0)) {
			result.valid = false;
			result.error = this.translateService.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
		}
		return result;
	}

	public validateBankTypeFk(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result = this.generalRequiredValidator(info);
		return result;
	}

	public async validateBankFk(info: ValidationInfo<IBusinessPartnerBankEntity>): Promise<ValidationResult> {
		const result: ValidationResult = { apply: true, valid: true };
		if (info.entity.BankFk) {
			const dataBank = await firstValueFrom(this.bankLookupService.getItemByKey({ id: info.entity.BankFk }));
			if (dataBank) {
				info.entity.BankName = dataBank.BankName;
				if (dataBank.BasCountryFk !== info.entity.CountryFk) {
					info.entity.CountryFk = dataBank.BasCountryFk;
				}
			} else {
				info.entity.BankName = null;
			}
		}
		return result;
	}

	public validateCountryFk(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result = this.generalRequiredValidator(info);
		this.basicsSharedDataValidationService.applyValidationResult(this.businessPartnerBankDataService, {
			entity: info.entity,
			field: 'CountryFk',
			result: result,
		});
		return result;
	}

	/*
	 * Validates the provided IBAN and automatically sets the bank details.
	 */
	public async asyncValidateIban(info: ValidationInfo<IBusinessPartnerBankEntity>): Promise<ValidationResult> {
		const result: ValidationResult = { apply: true, valid: true };
		if (info.value&& info.value !== ''){
			this.basicsSharedDataValidationService.applyValidationResult(this.businessPartnerBankDataService, {
				entity: info.entity,
				field: 'AccountNo',
				result: result,
			});
			const value = info.value.toString().replace(/\s/g, '');
			// region validate
			const resultIbanValid = IBAN.isValid(value);
			if (!resultIbanValid) {
				result.valid = false;
				result.error = this.translateService.instant('platform.errorMessage.iban').text;
				return result;
			}
			// endregion
			// region validate success
			const countryCode = value.slice(0, 2);
			const countrySpec = IBAN.countries[countryCode];

			if (!countrySpec?.structure) {
				return result;
			}
			//_regex is iban.js function don't change this logic
			const bankRegexStructure = (countrySpec as { _regex?: () => RegExp })._regex?.();
			if (!bankRegexStructure) {
				return result;
			}

			const bbanCode = value.slice(4);
			const regex = new RegExp(bankRegexStructure);
			const bankCode = regex.exec(bbanCode);

			if (!bankCode?.[1]) {
				return result;
			}

			const searchRequest: ILookupSearchRequest = {
				searchText: '',
				searchFields: [],
				filterString: `SortCode="${bankCode[1]}"`,
			};

			const resultBankLookup = await firstValueFrom(this.basicsShareBankLookupService.getSearchList(searchRequest));
			if (!resultBankLookup?.items || resultBankLookup.items.length === 0 || !resultBankLookup.items[0]) {
				return result;
			}
			if (resultBankLookup) {
				info.entity.BankFk = resultBankLookup.items[0].Id;
				info.entity.BankName = resultBankLookup.items[0].BankName;
				info.entity.CountryFk = resultBankLookup.items[0].BasCountryFk;
			}
			// endregion
		}
		if (!info.value || info.value === '') {
			if (!info.entity.AccountNo || info.entity.AccountNo === '') {
				const p0 = this.translateService.instant('cloud.common.entityBankIBan').text;
				const p1 = this.translateService.instant('cloud.common.entityBankAccountNo').text;
				result.error = this.translateService.instant('cloud.common.entryShouldExistFields', { p0: p0, p1: p1 }).text;
				result.valid = false;
				this.basicsSharedDataValidationService.applyValidationResult(this.businessPartnerBankDataService, {
					entity: info.entity,
					field: 'AccountNo',
					result: result,
				});
			}
			return result;
		}


		return result;
	}

	public ValidateAccountNo(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		if (info.value&& info.value !== '') {
			this.basicsSharedDataValidationService.applyValidationResult(this.businessPartnerBankDataService, {
				entity: info.entity,
				field: 'Iban',
				result: result,
			});
		}
		if (!info.value || info.value === '') {
			if (!info.entity.Iban || info.entity.Iban === '') {
				const p0 = this.translateService.instant('cloud.common.entityBankIBan').text;
				const p1 = this.translateService.instant('cloud.common.entityBankAccountNo').text;
				result.error = this.translateService.instant('cloud.common.entryShouldExistFields', { p0: p0, p1: p1 }).text;
				result.valid = false;
				this.basicsSharedDataValidationService.applyValidationResult(this.businessPartnerBankDataService, {
					entity: info.entity,
					field: 'Iban',
					result: result,
				});
			}
			return result;
		}
		return result;
	}

	public validateIsDefault(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		this.updateIsDefault(info, IsDefaultType.IsDefault);
		return result;
	}

	public validateIsDefaultCustomer(info: ValidationInfo<IBusinessPartnerBankEntity>): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		this.updateIsDefault(info, IsDefaultType.IsDefaultCustomer);
		return result;
	}

	private updateIsDefault(info: ValidationInfo<IBusinessPartnerBankEntity>, isDefaultType: IsDefaultType): void {
			const banks = this.businessPartnerBankDataService.getList();
			if (banks) {
				for (const bank of banks) {
					if (bank.Id !== info.entity.Id && info.value) {
						switch (isDefaultType) {
							case IsDefaultType.IsDefault:
								bank.IsDefault = false;
								break;
							case IsDefaultType.IsDefaultCustomer:
								bank.IsDefaultCustomer = false;
								break;
						}
						this.businessPartnerBankDataService.setModified(banks);
					}
				} // end for
		}
	}
}
