/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IProcurementConfigurationToBillingSchemaLookupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for billing schema which can be filtered according to procurement configuration
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsShareProcurementConfigurationToBillingSchemaLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IProcurementConfigurationToBillingSchemaLookupEntity, TEntity> {
	public constructor() {
		super('PrcConfig2BSchema', {
			uuid: 'f4239b43c09f495fbd8a0194e84138df',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
		});
	}
}
