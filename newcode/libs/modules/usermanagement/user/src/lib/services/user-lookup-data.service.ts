/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IAccessUsersInGroupEntity } from '@libs/usermanagement/interfaces';
import { Injectable } from '@angular/core';

/**
 * Usermanagement User lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class UsermanagementUserLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IAccessUsersInGroupEntity, TEntity> {
	public constructor() {
		super('user', {
			uuid: 'd7d15f594e5847eab1cb7eacc7712eb1',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Name'
		});
	}
}
