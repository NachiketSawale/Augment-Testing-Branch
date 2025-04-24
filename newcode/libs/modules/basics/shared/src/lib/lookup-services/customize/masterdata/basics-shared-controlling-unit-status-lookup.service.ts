/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingUnitStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingUnitStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingUnitStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingUnitStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/controllingunitstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '54d8644ab325460095aae7c787507d57',
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
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isopen',
						model: 'Isopen',
						type: FieldType.Boolean,
						label: { text: 'Isopen' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
