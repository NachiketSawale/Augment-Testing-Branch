/*
 * Copyright(c) RIB Software GmbH
 */

import {UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {CurrencyEntity} from './entities/currency-entity.class';
import {Injectable} from '@angular/core';

/**
 * Currency Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCurrencyLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<CurrencyEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('Currency', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Currency'
		});
	}
}