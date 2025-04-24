import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { SupplierDataService } from '../suppiler-data.service';
import { BasicsSharedDataValidationService, BasicsSharedNumberGenerationService, BasicsSharedSupplierLedgerGroupLookupService } from '@libs/basics/shared';
import { isNumber, map } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { ICheckSupplierCodeLengthResponse } from '../../model/responses/check-supplier-code-length-response';
import { number } from 'mathjs';
import { ILookupSearchRequest } from '@libs/ui/common';
import { ISupplierEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SupplierValidationService extends BaseValidationService<ISupplierEntity> {
	private readonly numberGenerationSettingsService = inject(BasicsSharedNumberGenerationService);
	private readonly basicsSharedSupplierLedgerGroupLookupService = inject(BasicsSharedSupplierLedgerGroupLookupService);
	private readonly http = inject(PlatformHttpService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(SupplierDataService);
	private readonly translate = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<ISupplierEntity> {
		return {
			Code: this.validateCode,
			BusinessPostingGroupFk: this.validateBusinessPostingGroupFk,
			SupplierLedgerGroupFk: this.ValidateSupplierLedgerGroupFk,
			RubricCategoryFk: this.validateRubricCategoryFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ISupplierEntity> {
		return this.dataService;
	}

	private generalRequiredValidator(info: ValidationInfo<ISupplierEntity>): ValidationResult {
		const result: ValidationResult = { apply: true, valid: true };
		if (!info.value || (isNumber(info.value) && info.value <= 0)) {
			result.valid = false;
			result.error = this.translate.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
		}
		return result;
	}

	private async validateCode(info: ValidationInfo<ISupplierEntity>): Promise<ValidationResult> {
		// region validate code if null and set isGenerated
		const result: ValidationResult = { apply: true, valid: true };
		if (info.entity.Version === 0 && info.entity.RubricCategoryFk) {
			const resultGeneration = this.numberGenerationSettingsService.hasNumberGenerateConfig(info.entity.RubricCategoryFk);
			if (resultGeneration) {
				info.entity.Code = this.translate.instant('cloud.common.isGenerated').text;
				return result;
			}
		}
		if (!info.value || info.value === '') {
			result.valid = false;
			result.error = this.translate.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
			return result;
		}
		const code = info.value.toString();
		const resultCodeLength = await this.http.get<ICheckSupplierCodeLengthResponse>('businesspartner/main/supplier/checksuppliercodelength?supplierLedgerGroupFk=' + info.entity.SupplierLedgerGroupFk);
		if (resultCodeLength) {
			let errorMsg = '';
			const codeLength = code.length;
			if (resultCodeLength.isCurrentContext && resultCodeLength.checkLength) {
				const maxLength = resultCodeLength.maxLength > 42 ? 42 : resultCodeLength.maxLength;
				if (codeLength < resultCodeLength.minLength || codeLength > maxLength) {
					errorMsg = this.translate.instant('businesspartner.main.errorMessage.fieldLengthRestrict', {
						p0: info.field,
						p1: resultCodeLength.minLength,
						p2: maxLength,
					}).text;
					result.valid = false;
					result.error = errorMsg;
					return result;
				}
			} else {
				if (codeLength > 16) {
					errorMsg = this.translate.instant('businesspartner.main.errorMessage.fieldLengthLessThenSpecificNumber', {
						p0: info.field,
						p1: 16,
					}).text;
					result.valid = false;
					result.error = errorMsg;
					return result;
				}
			}
		}
		// endregion
		// region validate SubledgerContextFk for code unique
		if (result.valid) {
			const searchRequest: ILookupSearchRequest = {
				searchText: '',
				searchFields: [],
				filterString: 'SubledgerContextFk=' + info.entity.SubledgerContextFk,
			};
			const responseLookUp = await firstValueFrom(this.basicsSharedSupplierLedgerGroupLookupService.getSearchList(searchRequest));
			if (responseLookUp?.items) {
				const ledgerGrpIds = map(responseLookUp.items, 'Id');
				const responseLedgerGroup = await this.http.post<ISupplierEntity[]>('businesspartner/main/supplier/getsupplierbysupplierledgergroup', ledgerGrpIds);
				if (responseLedgerGroup) {
					// region check if code unique
					const errorMsg = this.translate.instant('businesspartner.main.errorMessage.codeUniqueInASublegerContext').text;
					let duplicateItem = responseLedgerGroup.find((e) => e.Code === code && e.Id !== info.entity.Id);
					if (duplicateItem) {
						result.valid = false;
						result.error = errorMsg;
					} else {
						const itemList = this.dataService.getList();
						duplicateItem = itemList.find((e) => e.Code === code && e.Id !== info.entity.Id && e.SubledgerContextFk === info.entity.SubledgerContextFk);
						if (duplicateItem) {
							result.valid = false;
							result.error = errorMsg;
						}
					}
					// endregion
				}
			}
		}
		return result;
	}

	private validateBusinessPostingGroupFk(info: ValidationInfo<ISupplierEntity>): ValidationResult {
		const result = this.generalRequiredValidator(info);
		return result;
	}

	private async ValidateSupplierLedgerGroupFk(info: ValidationInfo<ISupplierEntity>): Promise<ValidationResult> {
		const result: ValidationResult = { apply: true, valid: true };
		if (!info.value || (isNumber(info.value) && info.value <= 0)) {
			result.valid = false;
			result.error = this.translate.instant({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } }).text;
		} else {
			// region double check code
			if (info.entity.Code) {
				info.entity.SupplierLedgerGroupFk = number(info.value.toString());
				const validationInfo: ValidationInfo<ISupplierEntity> = {
					entity: info.entity,
					value: info.entity.Code,
					field: 'Code',
				};
				const resultValidateCode = await this.validateCode(validationInfo);
				return resultValidateCode;
			}
			// endregion
		}
		return result;
	}

	private validateFieldsOnCreate(info: ValidationInfo<ISupplierEntity>) {
		// todo wait to check  if create will do validation ,if do it dont need this function
		// const result = this.validateCode(info);
		// this.validationUtils.applyValidationResult(this.customerDataService, {
		// 	entity: info.entity,
		// 	field: 'Code',
		// 	result: result,
		// });
		// const res = this.validateCustomerLedgerGroupFk(info);
		// this.validationUtils.applyValidationResult(this.customerDataService, {
		// 	entity: info.entity,
		// 	field: 'CustomerLedgerGroupFk',
		// 	result: res,
		// });
		// this.validationUtils.applyValidationResult(this.customerDataService, {
		// 	entity: info.entity,
		// 	field: 'BpdDunninggroupFk',
		// 	result: this.validateBpdDunninggroupFk(info),
		// });
	}

	private async validateRubricCategoryFk(info: ValidationInfo<ISupplierEntity>) {
		let validResultCode: ValidationResult = { apply: true, valid: true };
		const validResultRubricCategoryFk: ValidationResult = { apply: true, valid: true };
		const errorMsg = this.translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: 'Code' }).text;
		if (info.entity.Version === 0) {
			// let codeReadOnly = false;
			if (!info.value) {
				info.entity.Code = '';
				info.entity.RubricCategoryFk = null;
				validResultCode = { apply: true, valid: false, error: errorMsg };
			} else {
				const rubricCategoryFk = number(info.value.toString());
				info.entity.RubricCategoryFk = rubricCategoryFk;
				const resultGeneration = this.numberGenerationSettingsService.hasNumberGenerateConfig(rubricCategoryFk);
				if (!resultGeneration) {
					info.entity.Code = '';
					validResultCode = { apply: true, valid: false, error: errorMsg };
				} else {
					info.entity.Code = this.translate.instant('cloud.common.isGenerated').text;
				}
			}
			this.validationUtils.applyValidationResult(this.dataService, {
				entity: info.entity,
				field: 'Code',
				result: validResultCode,
			});
			await this.dataService.readonlyProcessor.updateEntityReadonly(info.entity);
		}
		return validResultRubricCategoryFk;
	}
}
