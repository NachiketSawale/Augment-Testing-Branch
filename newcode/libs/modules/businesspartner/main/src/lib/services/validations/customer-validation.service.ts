import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BusinesspartnerMainCustomerDataService } from '../customer-data.service';
import { BusinesspartnerCommonNumberGenerationService } from '@libs/businesspartner/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { isEmpty, isNull, isNumber, isUndefined } from 'lodash';
import { ICheckCustomerCodeHttpresponseEntityInterface, ICustomerEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class CustomerValidationService extends BaseValidationService<ICustomerEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private customerDataService = inject(BusinesspartnerMainCustomerDataService);
	private bpCommonNumberGenerationService = inject(BusinesspartnerCommonNumberGenerationService);
	private translate = inject(PlatformTranslateService);
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	protected generateValidationFunctions(): IValidationFunctions<ICustomerEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			BusinessUnitFk: this.validateBusinessUnitFk,
			BusinessPostingGroupFk: this.validateBusinessPostingGroupFk,
			CustomerLedgerGroupIcFk: this.validateCustomerLedgerGroupIcFk,
			BpdDunninggroupFk: this.validateBpdDunninggroupFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICustomerEntity> {
		return this.customerDataService;
	}

	private asyncValidateSubledgerContextAndCode(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		const result = this.requiredValidator(info);
		if (!result.valid || info.value === this.translate.instant({ key: 'cloud.common.isGenerated' }).text) {
			return result;
		}
		this.http.get(this.config.webApiBaseUrl + 'businesspartner/main/customer/checkcustomercodelength?customerLedgerGroupFk=' + info.entity.CustomerLedgerGroupFk).subscribe((res) => {
			const response = res as ICheckCustomerCodeHttpresponseEntityInterface;
			if (!isNull(response)) {
				if (response.isCurrentContext) {
					const codeLength = (info.value as string).length;
					if (response.checkLength) {
						if (codeLength < response.minLength || codeLength > response.maxLength) {
							result.error = this.translate.instant({
								key: 'businesspartner.main.errorMessage.fieldLengthRestrict',
								params: {
									p0: info.field,
									p1: response.minLength,
									p2: response.maxLength,
								},
							}).text;
							result.valid = false;
						}
					} else {
						if (codeLength > 16) {
							result.error = this.translate.instant({
								key: 'businesspartner.main.errorMessage.fieldLengthLessThenSpecificNumber',
								params: {
									p0: info.field,
									p1: 16,
								},
							}).text;
							result.valid = false;
						}
					}
					if (!result.valid) {
						return result;
					}
				}
			}
			if (result.valid) {
				//TODO:
				return result;
			}
			return result;
		});
		return result;
	}

	private requiredValidator(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		const result = new ValidationResult();
		result.valid = true;
		result.apply = true;
		if (isUndefined(info.value) || isNull(info.value) || (isNumber(info.value) && info.value <= 0) || isEmpty(info.value)) {
			result.error = this.translate.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
		}
		return result;
	}

	protected validateCode(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		const result = new ValidationResult();
		result.valid = true;
		result.apply = true;
		if (info.entity.Version === 0 && this.bpCommonNumberGenerationService.hasToGenerateForRubricCategory(info.entity.RubricCategoryFk)) {
			info.entity.Code = this.translate.instant({ key: 'cloud.common.isGenerated' }).text;
		}
		return result;
	}

	protected asyncValidateCode(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		return this.asyncValidateSubledgerContextAndCode(info);
	}

	protected validateBusinessUnitFk(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	protected validateBusinessPostingGroupFk(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	protected validateCustomerLedgerGroupIcFk(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		const result = this.requiredValidator(info);
		if (result.valid) {
			info.entity.CustomerLedgerGroupFk = info.value as number;
			this.asyncValidateCode(info);
		}
		return result;
	}

	protected validateCustomerLedgerGroupFk(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		const result = this.requiredValidator(info);
		return result;
	}

	protected validateBpdDunninggroupFk(info: ValidationInfo<ICustomerEntity>): ValidationResult {
		return this.requiredValidator(info);
	}

	public validateFieldsOnCreate(info: ValidationInfo<ICustomerEntity>) {
		const result = this.validateCode(info);
		this.validationUtils.applyValidationResult(this.customerDataService, {
			entity: info.entity,
			field: 'Code',
			result: result,
		});
		const res = this.validateCustomerLedgerGroupFk(info);
		this.validationUtils.applyValidationResult(this.customerDataService, {
			entity: info.entity,
			field: 'CustomerLedgerGroupFk',
			result: res,
		});
		this.validationUtils.applyValidationResult(this.customerDataService, {
			entity: info.entity,
			field: 'BpdDunninggroupFk',
			result: this.validateBpdDunninggroupFk(info),
		});
	}
}
