/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourceGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourceGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourceGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourceGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resourcegroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7f43cb2acfb2478398726ecba6b8e032',
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
						id: 'GroupFk',
						model: 'GroupFk',
						type: FieldType.Quantity,
						label: { text: 'GroupFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
