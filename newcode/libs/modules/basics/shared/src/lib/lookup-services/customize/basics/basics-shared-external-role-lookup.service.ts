/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExternalRoleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExternalRoleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExternalRoleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExternalRoleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/externalrole/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b9b403f46e89417092785dfc0798cccd',
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
						id: 'Comment',
						model: 'Comment',
						type: FieldType.Comment,
						label: { text: 'Comment' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
