/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { IBusinessPartnerEntity, IDuplicateSimpleRequest, IDuplicateTelephoneRequest } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { AddressEntity, BasicsSharedDataValidationService, TelephoneEntity } from '@libs/basics/shared';
import { get, set, isObject, isNil, isEmpty } from 'lodash';
import { PlatformTranslateService, PropertyType, ServiceLocator } from '@libs/platform/common';
import { BusinessPartnerHelperService } from '../helper/businesspartner-helper.service';
import { BusinessPartnerMainSubsidiaryDataService } from '../subsidiary-data.service';
import { SUBSIDIARY_COMPLEX_FIELD_MAP } from '../../model/constants/subsidiary-complex-field-map.model';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainHeaderValidationService extends BaseValidationService<IBusinessPartnerEntity> {

	private readonly headerDataService: BusinesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly helper: BusinessPartnerHelperService = new BusinessPartnerHelperService();

	protected override generateValidationFunctions(): IValidationFunctions<IBusinessPartnerEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			BusinessPartnerName1: this.validateBusinessPartnerName1,
			CrefoNo: this.asyncValidateCrefoNo,
			BedirektNo: this.asyncValidateBedirektNo,
			DunsNo: this.asyncValidateDunsNo,
			VatNo: this.asyncValidateVatNo,
			VatNoEu: this.asyncValidateVatNoEu,
			TaxNo: this.asyncValidateTaxNo,
			TradeRegisterNo: this.asyncValidateTradeRegisterNo,
			TradeRegister: this.validateTradeRegister,
			TradeRegisterDate: this.validateTradeRegisterDate,
			Email: this.asyncValidateEmail,
			CompanyFk: this.validateCompanyFk,
			RubricCategoryFk: this.validateRubricCategoryFk,
			VatCountryFk: this.validateVatCountryFk,
			Internet: this.validateInternet,
			// todo chi: it seems complex field is not supported.
		};
	}

	public validateCode(info: ValidationInfo<IBusinessPartnerEntity>, apply?: boolean): ValidationResult {
		const result = this.validationService.isMandatory(info, 'cloud.common.code');
		if (apply) {
			result.apply = true;
		}
		return result;
	}

	protected async asyncValidateCode(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const validResult = await this.validationService.isAsyncUnique(info, 'businesspartner/main/businesspartner/isunique',
			'cloud.common.code');

		const entityValue = get(info.entity, info.field);
		if (!entityValue && isObject(validResult)) {
			validResult.apply = true;
		}
		return validResult;
	}

	public async validateBusinessPartnerName1(info: ValidationInfo<IBusinessPartnerEntity>) {

		const result: ValidationResult = {apply: true, valid: true};
		if (info.value === undefined || info.value === null || info.value === -1 || (info.value as string).trim() === '') {
			result.valid = false;
			result.error = this.translationService.instant({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: this.translationService.instant('businesspartner.main.name1')}
			}).text;
		}
		if (info.entity && !info.entity.MatchCode && info.value) {
			const charMap: { [key: string]: string } = {
				'Ä': 'A', 'ä': 'A', 'à': 'A',
				'ç': 'C',
				'é': 'E', 'è': 'E', 'ê': 'E',
				'î': 'I',
				'Ö': 'O', 'ö': 'O',
				'ß': 'S',
				'Ü': 'U', 'ü': 'U', 'ù': 'U', 'û': 'U'
			};

			info.entity.MatchCode = (info.value as string)
				.replace(/[ÄäàçéèêîÖößÜüùû]/g, (char) => charMap[char] || char)
				.replace(/[^A-Za-z0-9]/g, '')
				.toUpperCase();
			await this.asyncValidationColumnsUnique(info.entity, info.entity.MatchCode, 'MatchCode', this.headerDataService.allUniqueColumns);
		}
		return result;
	}

	protected async asyncValidateCrefoNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		return await this.asyncValidateDuplicate(info, 'duplicatelistbycrefono');
	}

	protected async asyncValidateBedirektNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const result = await this.asyncValidateDuplicate(info, 'duplicatelistbybedirektno');
		this.updateMainSubsidiary(result, info.field, info.value);
		return result;
	}

	protected async asyncValidateDunsNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		return await this.asyncValidateDuplicate(info, 'duplicatelistbydunsno');
	}

	protected async asyncValidateVatNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		const model = info.field;
		const countryFk = entity.SubsidiaryDescriptor?.AddressDto ? entity.SubsidiaryDescriptor.AddressDto.CountryFk : null;
		const result = this.validationService.createSuccessObject();
		if (!value) {
			this.updateMainSubsidiary(result, model, value);
			return Promise.resolve(result);
		} else {
			const checkData = {
				MainItemId: entity.Id,
				Value: value as string,
				IsFromBp: true,
				IsVatNoField: true,
				CountryFk: countryFk
			};
			const result2 = await this.helper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, this.headerDataService, this, null);
			if (result2) {
				if (result2.valid) {
					this.updateMainSubsidiary(result2, model, value);
				}
				return result2;
			}

			return result;
		}
	}

	protected async asyncValidateVatNoEu(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const result = {valid: true, apply: true};
		const entity = info.entity;
		const value = info.value;
		if (!value) {
			return Promise.resolve(result);
		} else {
			const checkData = {
				MainItemId: entity.Id,
				Value: value as string,
				IsFromBp: true,
				IsVatNoField: true,
				CountryFk: entity.VatCountryFk ?? null,
				IsEu: true
			};
			return await this.helper.asyncValidateVatNoOrTaxNo(entity, value, info.field, checkData, this.headerDataService, this, null);
		}
	}

	protected async asyncValidateTaxNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		const model = info.field;
		const result = this.validationService.createSuccessObject();
		const countryFk = entity.SubsidiaryDescriptor?.AddressDto ? entity.SubsidiaryDescriptor.AddressDto.CountryFk : null;
		if (!value) {
			// todo chi: need?
			// platformRuntimeDataService.applyValidationResult(true, entity, model);
			this.updateMainSubsidiary(result, model, value);
			return Promise.resolve(result);
		} else {
			const checkData = {
				MainItemId: entity.Id,
				Value: value as string,
				IsFromBp: true,
				IsVatNoField: false,
				CountryFk: countryFk
			};
			const result2 = await this.helper.asyncValidateVatNoOrTaxNo(entity, value, model, checkData, this.headerDataService, this, null);
			if (result2) {
				if (result2.valid) {
					this.updateMainSubsidiary(result2, model, value);
				}
				return result2;
			}
			return result;
		}
	}

	protected async asyncValidateTradeRegisterNo(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const result = await this.asyncValidateDuplicate(info, 'duplicatelistbytraderegisterno');
		this.updateMainSubsidiary(result, info.field, info.value);
		return result;
	}

	protected validateTradeRegister(info: ValidationInfo<IBusinessPartnerEntity>): ValidationResult {
		const result = this.validationService.createSuccessObject();
		this.updateMainSubsidiary(result, info.field, info.value);
		return result;
	}

	protected validateTradeRegisterDate(info: ValidationInfo<IBusinessPartnerEntity>): ValidationResult {
		return this.validateTradeRegister(info);
	}

	protected async asyncValidateEmail(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const needToCheck = this.headerDataService.getDuplicateCheckEmail();
		const result: ValidationResult = {
			valid: true,
			apply: true
		};
		const value = info.value;
		const model = info.field;
		const subsidiaryService = ServiceLocator.injector.get(BusinessPartnerMainSubsidiaryDataService);
		if (!this.isEmailValid(value as string, needToCheck)) {
			result.valid = false;
			result.error = this.translationService.instant({key: 'platform.errorMessage.email'}).text;
			return Promise.resolve(result);
		} else if (!value || needToCheck === 0) {
			subsidiaryService.updateSubsidiaryByHeaderItem(model, value, result);
			return Promise.resolve(result);
		} else {
			const validateRes = await this.helper.asyncValidateEmail(info, null, this.headerDataService, this, null/* , asyncMarker */, needToCheck);
			subsidiaryService.updateSubsidiaryByHeaderItem(model, value, validateRes);
			return validateRes;
		}
	}

	protected async validateCompanyFk(info: ValidationInfo<IBusinessPartnerEntity>) {
		const result = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value;
		if (entity.Version === 0) {
			if (entity.RubricCategoryFk && value) {
				await this.headerDataService.setCodeByData(entity, entity.RubricCategoryFk, value as number);
			}
		}
		return result;
	}

	protected async validateRubricCategoryFk(info: ValidationInfo<IBusinessPartnerEntity>) {
		const result = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value;
		if (entity.Version === 0) {
			if (!value) {
				entity.Code = null;
				await this.headerDataService.readonlyProcessor.updateEntityReadonly(entity);
			} else if (value && entity.CompanyFk) {
				await this.headerDataService.setCodeByData(entity, value as number, entity.CompanyFk);
			}
		}
		return result;
	}

	protected async validateVatCountryFk(info: ValidationInfo<IBusinessPartnerEntity>) {
		const result = this.validationService.createSuccessObject();
		const vatNoEuModel = 'VatNoEu';
		const vatNoEuValue = get(info.entity, vatNoEuModel) ?? undefined;
		await this.asyncValidateVatNoEu({entity: info.entity, value: vatNoEuValue, field: vatNoEuModel});
		return result;
	}

	protected validateInternet(info: ValidationInfo<IBusinessPartnerEntity>) {
		let result = this.validationService.createSuccessObject();
		const maxLength = 100;
		const value = info.value;
		if (!value) {
			return result;
		}
		if ((value as string).length > maxLength) {
			result.valid = false;
			result.error = this.translationService.instant({
				key: 'basics.common.validation.exceedMaxLength',
				params: {length: maxLength}
			}).text;
		} else {
			result = this.validationService.validateUrl(info);
		}
		return result;
	}

	// todo chi: do it later
	// service['asyncValidateSubsidiaryDescriptor$AddressDto'] = asyncValidateAddress;
	// service['asyncValidateSubsidiaryDescriptor$TelephoneNumber1Dto'] = asyncValidateTelephone;
	// service['asyncValidateSubsidiaryDescriptor$TelephoneNumber2Dto'] = asyncValidateTelephoneWithOutDuplicate;
	// service['asyncValidateSubsidiaryDescriptor$TelephoneNumberTelefaxDto'] = asyncValidateTelephone;
	// service['asyncValidateSubsidiaryDescriptor$TelephoneNumberMobileDto'] = asyncValidateTelephoneWithOutDuplicate;

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartnerEntity> {
		return this.headerDataService;
	}

	public async asyncValidationColumnsUnique(entity: IBusinessPartnerEntity, value: PropertyType | undefined, field: string, uniqueFields: string[]) {

		if (field === 'BedirektNo' || field === 'VatNo' || field === 'TaxNo' ||
			field === 'TradeRegisterNo' || field === 'TradeRegister' || field === 'TradeRegisterDate') {
			const result = await this.helper.asyncValidationColumnsUnique(entity, value, field, uniqueFields, this.headerDataService);
			this.updateMainSubsidiary(result, field, value);
			return result;
		}
		return this.validationService.createSuccessObject();
	}

	private updateMainSubsidiary(result: ValidationResult, field: string, value: PropertyType | undefined) {
		if (result.apply) {
			const subsidiaryDataService = ServiceLocator.injector.get(BusinessPartnerMainSubsidiaryDataService);
			const mainSubsidiaryItem = subsidiaryDataService.getMainItem();
			const parentBp = this.headerDataService.getSelection();
			if (parentBp && parentBp.length > 0 && mainSubsidiaryItem && parentBp[0].SubsidiaryDescriptor) {
				// when creating bp via different ways, it can insure 'VatNo' and 'TaxNo' with value to Subsidiary.
				set(parentBp[0].SubsidiaryDescriptor, field, value);
				// changes in bp can synchronize to subsidiary UI.
				set(mainSubsidiaryItem, field, value);
			}
		}
	}

	private async asyncValidateDuplicate(info: ValidationInfo<IBusinessPartnerEntity>, request: string,
	                               checkData?: IDuplicateTelephoneRequest | IDuplicateSimpleRequest,
	                               updateSubsidiary?: boolean): Promise<ValidationResult> {
		if (!checkData) {
			checkData = {
				MainItemId: info.entity.Id,
				Value: info.value as string
			};
		}

		const updateRelatedDataFunc = (entity: IBusinessPartnerEntity, value: PropertyType | TelephoneEntity | undefined, model: string, validationResult: ValidationResult) => {
			const subsidiaryService = ServiceLocator.injector.get(BusinessPartnerMainSubsidiaryDataService);
			if (entity.SubsidiaryDescriptor && SUBSIDIARY_COMPLEX_FIELD_MAP[model]) {
				set(entity.SubsidiaryDescriptor, SUBSIDIARY_COMPLEX_FIELD_MAP[model].pattern ?? '', value ? get(value, 'Pattern') : null);
			}
			if (updateSubsidiary) {
				if (validationResult && entity.SubsidiaryDescriptor && SUBSIDIARY_COMPLEX_FIELD_MAP[model]) {
					if (validationResult.valid) {
						subsidiaryService.removeInvalid(entity.SubsidiaryDescriptor, {
							field: SUBSIDIARY_COMPLEX_FIELD_MAP[model].dto,
							result: validationResult
						});
					} else {
						subsidiaryService.addInvalid(entity.SubsidiaryDescriptor, {
							field: SUBSIDIARY_COMPLEX_FIELD_MAP[model].dto,
							result: validationResult
						});
					}
				}

				subsidiaryService.updateSubsidiaryByHeaderItem(model, value, validationResult);
			}
		};
		return await this.helper.asyncValidationDuplicate(info.entity, info.value, info.field, request, checkData,
			this.headerDataService, null, this, updateRelatedDataFunc);
	}

	private isEmailValid(value: string | undefined, needToCheck: number/* , entity: IBusinessPartnerEntity */) {
		if (needToCheck === 1) {
			const regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
			const regex2 = /@[\s\S]*@/;
			return isNil(value) || isEmpty(value) || regex1.test(value) && !regex2.test(value);
		}
		return true;
	}

	private async asyncValidateAddress(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		// todo chi: should do it
		const result = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value;
		const model = info.field;
		// const originalAddress = get(entity, model);
		// const subsidiaryService = ServiceLocator.injector.get(BusinessPartnerMainSubsidiaryDataService);
		// subsidiaryService.updateSubsidiaryByHeaderItem(model, value, result);

		if (!entity.VatCountryFk) {
			entity.VatCountryFk = value ? (value as unknown as AddressEntity).CountryFk : undefined;
		}
		set(entity, model, value);
		await this.asyncValidateVatNo({entity: entity, value: entity.VatNo ?? undefined, field: 'VatNo'});
		await this.asyncValidateTaxNo({entity: entity, value: entity.TaxNo ?? undefined, field: 'TaxNo'});
		// const originalCountryFk = originalAddress ? originalAddress.CountryFk : null;
		// const newCountryFk = value ? (value as unknown as AddressEntity).CountryFk : null;
		// const originalLegalFormFk = entity.LegalFormFk;
		// if (originalCountryFk !== newCountryFk) {
		// 		const legalFormService = ServiceLocator.injector.get(LegalFormService);
		// 		const legalFormFk = await legalFormService.getDefaultId(newCountryFk, entity.LegalFormFk);
		// 	entity.LegalFormFk = legalFormFk;
		// }

		return Promise.resolve(result);
	}

	private async asyncValidateTelephone(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		const checkData: IDuplicateTelephoneRequest = {
			MainItemId: entity.Id,
			TelephoneDto: value ? value as unknown as TelephoneEntity : undefined,
			IsCheckDuplicate: true,
			Pattern: value ? get(value, 'Pattern') : undefined
		};
		return await this.asyncValidateDuplicate(info, 'duplicatelistbytelephonenumber', checkData, true);
	}

	private async asyncValidateTelephoneWithOutDuplicate(info: ValidationInfo<IBusinessPartnerEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		const checkData = {
			MainItemId: entity.Id,
			TelephoneDto: value ? value as unknown as TelephoneEntity : undefined,
			IsCheckDuplicate: false,
			Pattern: value ? get(value, 'Pattern') : undefined
		};
		return await this.asyncValidateDuplicate(info, 'duplicatelistbytelephonenumber', checkData, true);
	}
}