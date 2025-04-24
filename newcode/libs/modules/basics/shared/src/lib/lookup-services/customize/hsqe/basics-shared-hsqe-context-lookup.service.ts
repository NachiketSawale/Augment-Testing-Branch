/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeHsqeContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeHsqeContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedHsqeContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeHsqeContextEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/hsqecontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cd892fec60294e559a27eaf4033dd35d',
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
