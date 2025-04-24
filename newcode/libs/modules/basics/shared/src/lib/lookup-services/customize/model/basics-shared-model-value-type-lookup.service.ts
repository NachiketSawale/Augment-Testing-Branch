/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelValueTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelValueTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelValueTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelValueTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelvaluetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8303fee87e4640ebb16e1a7bc72220c6',
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
						id: 'BaseValueTypeFk',
						model: 'BaseValueTypeFk',
						type: FieldType.Quantity,
						label: { text: 'BaseValueTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
