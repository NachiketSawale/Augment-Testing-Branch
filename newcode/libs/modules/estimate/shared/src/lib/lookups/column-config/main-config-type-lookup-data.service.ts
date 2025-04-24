/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEstConfigTypeEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class MainConfigTypeLookupDataService <TEntity extends object = object> extends UiCommonLookupEndpointDataService<IEstConfigTypeEntity, TEntity> {
	/**
	 * Constructor
	 */
	public constructor() {
		super(
			{
				httpRead: { route: 'estimate/main/configtype/', endPointRead: 'list', usePostForRead: true},
			},
			{
				uuid: 'c4f9c32e6cc149aa830ec7dddc7391e5',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
			},
		);
	}
}