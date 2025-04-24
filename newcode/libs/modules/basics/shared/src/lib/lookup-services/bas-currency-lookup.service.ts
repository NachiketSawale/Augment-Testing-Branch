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
export class BasicsSharedBasCurrencyLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<CurrencyEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('BasCurrency', {
			uuid: 'c1179fd57f954f339ec45b00a8a5239f',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Currency'
		});
	}
}