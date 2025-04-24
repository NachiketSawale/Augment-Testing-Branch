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
export class BasicsSharedTextModuleTypeSimpleLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.textmoduletype', {
			uuid: 'cdde747f8a7e4df6a15830eb01defeb5',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}