/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Basic BiPlusDesigner Dashboard Type Form LookupService
 */
export class BasicBiPlusDesignerDashboardTypeFormLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.dashboardtype', {
			displayMember: 'Description',
			uuid: 'f07bf13df6bb0da129dc9adf',
			valueMember: 'Id',
		});
	}
}
