/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IAccessUser2GroupEntity } from '@libs/usermanagement/interfaces';
import { Injectable } from '@angular/core';

/**
 * Usermanagement Group lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementGroupLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IAccessUser2GroupEntity, TEntity> {
	public constructor() {
		super('accessgroup', {
			uuid: 'd7d15f594e5847eab1cb7eacc7712eb1',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Name'
		});
	}
}