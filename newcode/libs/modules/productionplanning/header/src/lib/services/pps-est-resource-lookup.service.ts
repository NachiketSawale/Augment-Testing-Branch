/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
/**
 * EstResource Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsEstResourceLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IEstResourceEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('estresource4itemassignment', {
			uuid: '3cad239e426448da9f57caa0863edfed',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showClearButton: true
		});
	}
}