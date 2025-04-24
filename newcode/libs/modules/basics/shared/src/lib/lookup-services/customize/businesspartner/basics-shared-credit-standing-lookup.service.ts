/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCreditStandingEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCreditStandingEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCreditStandingLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCreditStandingEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/creditstanding/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '293b4e19da2046c4aabf0a10f7592a6b',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
