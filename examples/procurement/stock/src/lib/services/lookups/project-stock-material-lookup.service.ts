/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectStock2MaterialEntity } from '@libs/project/interfaces';
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';

/**
 * Procurement Project Stock Material lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementProjectStockMaterialLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProjectStock2MaterialEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		super('ProjectStock2Material', {
			uuid: 'd66443615764481694766ec8d5f0293c ',
			valueMember: 'Id',
			displayMember: 'LoadingCostPercent',
		});
	}
}
