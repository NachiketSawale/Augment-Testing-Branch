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
export class BasicsSharedRoundingLogicTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('basics.lookup.roundlogictype', {
			uuid: 'df4fefcee4d6496ca5986d25f9091e6c',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}