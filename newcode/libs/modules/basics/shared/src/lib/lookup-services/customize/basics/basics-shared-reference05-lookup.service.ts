/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReference05Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReference05Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReference05LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReference05Entity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reference05/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '566cb305d89c4d68b8c5530fa752bf65',
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
