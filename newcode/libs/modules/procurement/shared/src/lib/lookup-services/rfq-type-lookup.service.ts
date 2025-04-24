/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IRfqTypeEntity } from './entities/rfq-type-entity.interface';


/**
 * Rfq Type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class RfqTypeLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IRfqTypeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('rfqType', {
			uuid: '19ad6579c3d444b59dc1256baf2v170d',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}