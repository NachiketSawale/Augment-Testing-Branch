/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupSimpleItem, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedDimensionTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<ILookupSimpleItem, TEntity> {
	public constructor() {
		super('basics.lookup.dimensiontype', {
			uuid: '8e35bd0897254b6a82668715d50822f3',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});
	}
}
