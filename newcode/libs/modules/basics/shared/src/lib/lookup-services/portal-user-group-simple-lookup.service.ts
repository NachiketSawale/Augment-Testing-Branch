/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService} from '@libs/ui/common';

/**
 * Rubric Category Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedPortalUserGroupSimpleLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.frmportalusergroup', {
			uuid: '5b55f1270f4f48b49d957f3b15c6b6d9',
			valueMember: 'Id',
			displayMember: 'Name'
		});
	}
}