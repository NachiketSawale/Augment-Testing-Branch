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
export class BasicsSharedRubricSimpleLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.rubric', {
			uuid: '4f4ab680d5c1430faae8370c73359b3a',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}