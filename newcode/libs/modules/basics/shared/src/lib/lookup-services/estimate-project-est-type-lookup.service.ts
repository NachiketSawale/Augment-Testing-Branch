/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupSimpleDataService } from '@libs/ui/common';
import { IEstimateProjectEstType } from './entities/estimate-project-est-type.interface';

@Injectable({
	providedIn: 'root',
})

/**
 * @name estimateProjectEstType
 * @requires estimateProjectEstTypeLookupService
 * @description Service for looking up estimate project estimation types.
 */
export class EstimateProjectEstTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<IEstimateProjectEstType, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('estimate.lookup.esttype', {
			uuid: 'd0dceaafb3464f2ba2e279e4c18afb2b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',

			selectableCallback: (e) => {
				return e.IsLive;
			},
		});
	}
}
