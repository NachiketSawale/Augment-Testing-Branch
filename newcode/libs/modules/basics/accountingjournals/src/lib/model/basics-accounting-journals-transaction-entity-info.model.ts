/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { AccountingJournalsTransactionDataService } from '../services/accounting-journals-transaction-data.service';
import { AccountingJournalsTransactionLayoutService } from '../services/accounting-journals-transaction-layout.service';
import { IAccountingJournalsTransactionEntity } from '../model/entities/accounting-journals-transaction-entity.interface';
import { AccountingJournalsTransactionValidationService } from '../services/accounting-journals-transaction-validation.service';

export const BASICS_ACCOUNTING_JOURNALS_TRANSACTION_ENTITY_INFO = EntityInfo.create<IAccountingJournalsTransactionEntity>({
	grid: {
		title: { text: 'Transaction', key: 'basics.accountingJournals.listTransactionTitle' },
	},
	form: {
		containerUuid: '1772fe6173c7471eb256e9fa08a054f6',
		title: { text: 'Transaction Detail', key: 'basics.accountingJournals.detailTransactionTitle' },
	},
	dataService: (ctx) => ctx.injector.get(AccountingJournalsTransactionDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Company', typeName: 'CompanyTransactionDto' },
	validationService: (ctx) => ctx.injector.get(AccountingJournalsTransactionValidationService),
	permissionUuid: 'c11b5b707ff744cf9a8eddd26633db43',
	layoutConfiguration: (context) => {
		return context.injector.get(AccountingJournalsTransactionLayoutService).generateConfig();
	},
});
