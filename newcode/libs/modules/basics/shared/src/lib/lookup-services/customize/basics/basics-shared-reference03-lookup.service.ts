/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReference03Entity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReference03Entity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReference03LookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReference03Entity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reference03/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'df208a39ef114a68a9029548b21a7d6e',
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
