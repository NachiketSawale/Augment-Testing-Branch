/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsHeaderGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsHeaderGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsHeaderGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsHeaderGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsheadergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '84986151e2d04678831ebe45e1a76028',
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
