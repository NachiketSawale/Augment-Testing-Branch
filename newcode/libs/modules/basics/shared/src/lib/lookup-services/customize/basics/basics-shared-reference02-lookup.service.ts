/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReference02Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReference02Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReference02LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReference02Entity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reference02/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8a2f7b18b0384f98b20e0131445cb67e',
			valueMember: 'Id',
			displayMember: 'CompanyFk',
			gridConfig: {
				columns: [
					{
						id: 'CompanyFk',
						model: 'CompanyFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OldValue',
						model: 'OldValue',
						type: FieldType.Description,
						label: { text: 'OldValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NewValue',
						model: 'NewValue',
						type: FieldType.Description,
						label: { text: 'NewValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
