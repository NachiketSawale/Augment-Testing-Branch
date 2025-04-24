/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupSimpleItem, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedObjectTextureLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<ILookupSimpleItem, TEntity> {
	public constructor() {
		super('basics.lookup.objecttexture', {
			uuid: '6b80b02c966341cea64533f78a67adb0',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});
	}
}
