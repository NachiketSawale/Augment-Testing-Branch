/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_ACCOUNTING_JOURNALS_ENTITY_INFO } from './basics-accounting-journals-entity-info.model';
import { BASICS_ACCOUNTING_JOURNALS_TRANSACTION_ENTITY_INFO } from './basics-accounting-journals-transaction-entity-info.model';

export class AccountingJournalsModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new AccountingJournalsModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.accountingjournals';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.AccountingJournals';
	}

	public override get preloadedTranslations() {
		return [...super.preloadedTranslations, 'basics.company', 'sales.common', 'sales.billing', 'sales.wip'];
	}

	public override get entities(): EntityInfo[] {
		return [BASICS_ACCOUNTING_JOURNALS_ENTITY_INFO, BASICS_ACCOUNTING_JOURNALS_TRANSACTION_ENTITY_INFO];
	}
}
