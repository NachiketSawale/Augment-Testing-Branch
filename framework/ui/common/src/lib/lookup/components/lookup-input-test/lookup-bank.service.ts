/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';

import {UiCommonLookupTypeLegacyDataService} from '../../services/lookup-type-legacy-data.service';

/**
 * Bank entity for testing
 */
export class BankEntity {
	public constructor(public Id: number, public BankName: string) {
	}
}

/**
 * Bank lookup service for testing
 */
@Injectable()
export class UiCommonLookupBankService extends UiCommonLookupTypeLegacyDataService<BankEntity, object> {
	public constructor() {
		super('Bank', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'BankName'
		});
	}
}