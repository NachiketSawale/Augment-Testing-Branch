/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingActivityStatusExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingActivityStatusExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingActivityStatusExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingActivityStatusExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingactivitystatusexternal/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3e0bb8a0c76f4bcfa20bcab71a801bcc',
			valueMember: 'Id',
			displayMember: 'ActStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ActStatusFk',
						model: 'ActStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ActStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExternalsourceFk',
						model: 'ExternalsourceFk',
						type: FieldType.Quantity,
						label: { text: 'ExternalsourceFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExtCode',
						model: 'ExtCode',
						type: FieldType.Comment,
						label: { text: 'ExtCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExtDescription',
						model: 'ExtDescription',
						type: FieldType.Comment,
						label: { text: 'ExtDescription' },
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
