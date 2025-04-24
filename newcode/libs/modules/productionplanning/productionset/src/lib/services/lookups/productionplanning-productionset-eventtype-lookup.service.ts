/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEventTypeEntity } from '@libs/productionplanning/configuration';

/**
 *
 */
@Injectable({
	providedIn: 'root',
})
export class ProductionPlanningProductionSetEventtypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEventTypeEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=eventtype' },
			},

			{
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Description',
				showGrid: false,
				uuid: 'b6f99b16e88645f3a00298dd55c50eb9',
			},
		);
	}
}
