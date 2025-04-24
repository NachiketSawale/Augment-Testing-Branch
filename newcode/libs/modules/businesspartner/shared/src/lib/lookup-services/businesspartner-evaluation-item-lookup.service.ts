/*
 * Copyright(c) RIB Software GmbH
*/

import {Injectable} from '@angular/core';
import {
	LookupSimpleEntity,
	UiCommonLookupTypeDataService
} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 *
 */
export class BusinesspartnerSharedEvaluationItemLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('EvaluationItem', {
			displayMember: 'Description',
			uuid: '886428d9b865483b89d4b32840e1f933',
			valueMember: 'Id',
			idProperty: 'Id',
		});
	}
}
