/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Basic BiPlusDesigner Dashboard Type Grid Lookup Service
 */
export class BasicBiPlusDesignerDashboardTypeGridLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.dashboardtype', {
			displayMember: 'Description',
			uuid: '32dca9d2967a5d148b3c4741',
			valueMember: 'Id',
		});
	}
}
