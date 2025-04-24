/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * Dependent Data Domain Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsDependentDataDomainLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: { route: 'basics/dependentdata/domain', endPointRead: 'lookup', usePostForRead: false },
		}, {
			uuid: '64c12f66ee5a42c9b2166276750807bc',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}