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
export class BasicsSharedTextModuleContextSimpleLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.textmodulecontext', {
			uuid: '760a7b940fe24936b87838bc92994dee',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}