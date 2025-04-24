/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsCustomizeEstConfigTypeEntity } from '@libs/basics/interfaces';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class MainConfigTypeLookupDataService <TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstConfigTypeEntity, TEntity> {
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/customize/EstConfigType/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dddc7391e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
}