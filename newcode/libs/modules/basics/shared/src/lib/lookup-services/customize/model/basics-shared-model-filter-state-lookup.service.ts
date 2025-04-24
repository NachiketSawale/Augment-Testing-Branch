/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelFilterStateEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelFilterStateEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelFilterStateLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelFilterStateEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/modelfilterstate/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c66234f78bc145d2becef072622ce9e3',
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
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Translation,
						label: { text: 'Remark' },
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
