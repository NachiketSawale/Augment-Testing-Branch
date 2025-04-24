/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo,
} from '@libs/platform/data-access';
import { IAccountingJournalsTransactionEntity } from '../model/entities/accounting-journals-transaction-entity.interface';
import { AccountingJournalsTransactionDataService } from './accounting-journals-transaction-data.service';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';


/**
 * Accounting Journals Transaction Validation Service
 */

@Injectable({
	providedIn: 'root',
})
export abstract class AccountingJournalsTransactionValidationService extends BaseValidationService<IAccountingJournalsTransactionEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translateService = inject(PlatformTranslateService);
	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: AccountingJournalsTransactionDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IAccountingJournalsTransactionEntity> {
		return {
			DocumentType: this.validateDocumentType,
			Currency: this.validateCurrency,
			VoucherNumber: this.validateVoucherNumber,
			PostingDate: this.validatePostingDate,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IAccountingJournalsTransactionEntity> {
		return this.dataService;
	}

	private validateDocumentType(info: ValidationInfo<IAccountingJournalsTransactionEntity>) {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'cloud.common.entityDocumentType');
	}

	private validateCurrency(info: ValidationInfo<IAccountingJournalsTransactionEntity>) {
		return this.validationUtils.isMandatory(info, 'cloud.common.entityCurrency');
	}

	private validateVoucherNumber(info: ValidationInfo<IAccountingJournalsTransactionEntity>) {
		return this.validationUtils.isMandatory(info, 'cloud.common.entityVoucherNumber');
	}

	private validatePostingDate(info: ValidationInfo<IAccountingJournalsTransactionEntity>) {
		return this.validationUtils.isMandatory(info, 'basics.accountingJournals.entityPostingDate');
	}
}