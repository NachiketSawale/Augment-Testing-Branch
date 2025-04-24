/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMdcControllingGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMdcControllingGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMdcControllingGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMdcControllingGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mdccontrollinggroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '61ceb6f4626c47b0adada898f5d8a2ac',
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
					}
				]
			}
		});
	}
}
