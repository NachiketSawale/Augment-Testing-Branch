/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedAccountingLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementStructureAccountDataService } from './basics-procurement-structure-account-data.service';
import { IPrcStructureAccountEntity } from '../model/entities/prc-structure-account-entity.interface';


/**
 * validation service for ProcurementStructure account
 */

@Injectable({
	providedIn: 'root'
})
export class BasicsProcurementStructureAccountValidationService extends BaseValidationService<IPrcStructureAccountEntity> {
	private dataService = inject(BasicsProcurementStructureAccountDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private readonly basicsSharedBasAccountLookupService = inject(BasicsSharedAccountingLookupService);

	protected generateValidationFunctions(): IValidationFunctions<IPrcStructureAccountEntity> {
		return {
			Account: this.validateAccount,
			OffsetAccount: this.validateOffsetAccount,
			PrcAccountTypeFk: this.validatePrcAccountTypeFk,
			TaxCodeFk: this.validateTaxCodeFk,
			BasControllingCatFk: this.validateBasControllingCatFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructureAccountEntity> {
		return this.dataService;
	}

	protected validateAccount(info: ValidationInfo<IPrcStructureAccountEntity>): ValidationResult {
		if (info.value) {
			const account = this.basicsSharedBasAccountLookupService.cache.getList().find(item => item.Code == info.value);
			if (account) {
				info.entity.BasAccountFk = account.Id;
			} else {
				info.entity.BasAccountFk = null;
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateOffsetAccount(info: ValidationInfo<IPrcStructureAccountEntity>): ValidationResult {
		if (info.value) {
			const account = this.basicsSharedBasAccountLookupService.cache.getList().find(item => item.Code == info.value);
			if (account) {
				info.entity.BasAccountOffsetFk = account.Id;
			} else {
				info.entity.BasAccountOffsetFk = null;
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validatePrcAccountTypeFk(info: ValidationInfo<IPrcStructureAccountEntity>): ValidationResult {
		return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
			PrcAccountTypeFk: <number>info.value,
			TaxCodeFk: info.entity.TaxCodeFk,
			BasControllingCatFk: info.entity.BasControllingCatFk,
		}, {
			key: 'basics.procurementstructure.threeFiledUniqueValueErrorMessage',
			params: {field1: 'account type', field2: 'tax code', field3: 'controlling cat'}
		});
	}

	protected validateBasControllingCatFk(info: ValidationInfo<IPrcStructureAccountEntity>): ValidationResult {
		return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
			PrcAccountTypeFk: info.entity.PrcAccountTypeFk,
			TaxCodeFk: info.entity.TaxCodeFk,
			BasControllingCatFk: <number>info.value
		}, {
			key: 'basics.procurementstructure.threeFiledUniqueValueErrorMessage',
			params: {field1: 'account type', field2: 'tax code', field3: 'controlling cat'}
		});
	}

	protected validateTaxCodeFk(info: ValidationInfo<IPrcStructureAccountEntity>): ValidationResult {
		return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
			PrcAccountTypeFk: info.entity.PrcAccountTypeFk,
			TaxCodeFk: <number>info.value,
			BasControllingCatFk: info.entity.BasControllingCatFk,
		}, {
			key: 'basics.procurementstructure.threeFiledUniqueValueErrorMessage',
			params: {field1: 'account type', field2: 'tax code', field3: 'controlling cat'}
		});
	}
}
