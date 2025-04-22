/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IPrcAwardMethodEntity } from './entities/prc-award-method-entity.interface';

/**
 * prc award method Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class PrcAwardMethodLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPrcAwardMethodEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PrcAwardMethod', {
			uuid: '377ebe9a7dc64bbda77b1da176b2c4bd',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}