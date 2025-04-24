/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IBillingSchemaEntity } from './entities/billing-schema-entity.interface';


/**
 * State Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsShareBillingSchemaLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IBillingSchemaEntity, TEntity> {
	public constructor() {
		super('BillingSchema', {
			uuid: '76b247e62e434043925adef2b572af57',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		},);

	}
}
