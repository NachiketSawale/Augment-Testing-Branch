/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * LedgerContext filter by current company  Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedLedgerContextByCompanyLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: {route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=ledgercontext'}
		}, {
			uuid: '1259106bb7304855a0ffc10428e3f123',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}