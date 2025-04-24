/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

/**
 * Dependent Data Type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsDependentDataTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('basics.dependentdata.type', {
			uuid: '1359106bb7304855a0ffc10428e3f799',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}