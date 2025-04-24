/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IQuoteTypeEntity } from './entities/quote-type-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementSharedQuoteTypeLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IQuoteTypeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('QuoteType', {
			uuid: '1d8eca8b229c49298129fd6b8fd77e04',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}