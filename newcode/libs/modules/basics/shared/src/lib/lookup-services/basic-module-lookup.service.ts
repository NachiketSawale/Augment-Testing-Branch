/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * module Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedModuleLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: {route: 'cloud/common/module/', endPointRead: 'lookup'}
		}, {
			uuid: '1359106bb7304855a0ffc10428e3f7a6',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description.Description'
		});
	}

	/**
	 * Because the underlying filterList method of the framework filters based on sorting and islive,
	 * the existing functionality is not required, so we override the filterList here
	 */
	public override filterList(list: LookupSimpleEntity[]): LookupSimpleEntity[] {
		return list;
	}
}