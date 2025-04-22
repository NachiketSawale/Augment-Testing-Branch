/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPropertyKeyEntity } from '../model/entities/property-key-entity.interface';

/**
 * The lookup data service for model property keys.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyLookupDataService<T extends object> extends UiCommonLookupTypeDataService<IPropertyKeyEntity, T> {

	public constructor() {
		super('PropertyKey', {
			uuid: 'dedbbf78b3cf44c8bfb6596c64efc1b6',
			displayMember: 'PropertyName',
			valueMember: 'Id'
		});
	}
}
