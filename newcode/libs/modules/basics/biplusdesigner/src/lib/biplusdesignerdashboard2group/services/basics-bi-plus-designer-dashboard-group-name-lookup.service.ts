/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Basic BiPlusDesigner Dashboard Group Name Lookup Service
 */
export class BasicBiPlusDesignerDashboardGroupNameLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	
	public constructor() {
		super('basics.customize.dashboardgroup', {
			displayMember: 'Name',
			uuid: '1f8227e67ca7007679fd459a',
			valueMember: 'Id',
		});
	}
}
