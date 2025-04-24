/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsFormworkSimpleLookupEntity } from '../../model/process-configuration/pps-formwork-simple-lookup-entity.interface';

/**
 * Formwork Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsFormworkLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsFormworkSimpleLookupEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('Formwork', {
			uuid: '6bcb7325a6f94951ad5a85ec86c97a8e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showClearButton: true
		});
	}
}