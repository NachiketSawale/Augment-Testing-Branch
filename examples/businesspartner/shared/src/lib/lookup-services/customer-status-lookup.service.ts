/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { CustomerStatusEntity } from '@libs/businesspartner/interfaces';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedCustomerStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<CustomerStatusEntity, TEntity> {
	public constructor() {
		super('customerStatus4BusinessParnter', {
			uuid: '0ab05ebd347b48a49a53809ee1f2bf76',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}