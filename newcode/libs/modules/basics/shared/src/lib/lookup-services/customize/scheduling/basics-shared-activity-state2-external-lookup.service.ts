/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeActivityState2ExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeActivityState2ExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedActivityState2ExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeActivityState2ExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/activitystate2external/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e1b5c5b1d81c421eb510575f7e183626',
			valueMember: 'Id',
			displayMember: 'ActivitystateFk',
			gridConfig: {
				columns: [
					{
						id: 'ActivitystateFk',
						model: 'ActivitystateFk',
						type: FieldType.Quantity,
						label: { text: 'ActivitystateFk' },
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
						type: FieldType.Description,
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
						id: 'Color',
						model: 'Color',
						type: FieldType.Quantity,
						label: { text: 'Color' },
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
