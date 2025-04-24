/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBusinessPostingGroupLookupEntity } from '@libs/businesspartner/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BusinessPostingGroupLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBusinessPostingGroupLookupEntity, TEntity> {
	public constructor() {
		super('BusinessPostingGroup', {
			uuid: '0aad3878bffad172a8cca63ba108b76c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
		});
	}
}
