/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IPpsPlannedQuantityPropertyEntity } from '../model/entities/pps-planned-quantity-property-entity.interface';

/**
 *
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPlannedQuantityPropertyLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPpsPlannedQuantityPropertyEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'productionplanning/producttemplate/productdescription/', endPointRead: 'getpropertiesforlookup' },
			},

			{
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Translation',
				uuid: '8a04026d37bb450e84f3452b887213c6',
			},
		);
	}
}
