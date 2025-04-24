/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {UiCommonLookupItemsDataService} from '../../services/lookup-items-data.service';


/**
 * Lookup data service for testing
 */
@Injectable()
export class UiCommonLookupInputTestService extends UiCommonLookupItemsDataService<LookupTestEntity, object> {
	public constructor() {
		const makeItems = (count: number) => {
			let index = 0;
			const items = [];
			while (index < count) {
				items.push(new LookupTestEntity(index, 'item' + index));
				index++;
			}
			return items;
		};


		super(makeItems(10000), {
			uuid: '',
			idProperty: 'id',
			valueMember: 'id',
			displayMember: 'description',
		});
		this.paging.enabled = true;
	}
}

/**
 * Lookup data entity for testing
 */
class LookupTestEntity {
	public constructor(public id: number, public description: string) {
	}
}
