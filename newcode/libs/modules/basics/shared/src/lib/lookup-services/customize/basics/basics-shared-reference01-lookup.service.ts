/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReference01Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReference01Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReference01LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReference01Entity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reference01/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6f65cb940aff4d5f9906f4fbaae60d4f',
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
