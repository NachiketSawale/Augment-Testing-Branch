/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IMaterialGroupCharEntity } from '../../../material/model/interfaces/material-group-char-entity.interface';

/**
 * Material Group Char Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IMaterialGroupCharEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('MaterialGroupChar', {
			uuid: 'c1179fd57f954f339ec45b00a8a5340g',
			valueMember: 'PropertyInfo.Translated',
			displayMember: 'PropertyInfo.Translated',
		});
	}
}
