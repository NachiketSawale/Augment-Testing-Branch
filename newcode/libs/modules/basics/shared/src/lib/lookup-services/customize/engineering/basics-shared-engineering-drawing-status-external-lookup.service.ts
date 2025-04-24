/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEngineeringDrawingStatusExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEngineeringDrawingStatusExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEngineeringDrawingStatusExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEngineeringDrawingStatusExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/engineeringdrawingstatusexternal/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7ae2139c5ef84cc89a835a13e51a5c04',
			valueMember: 'Id',
			displayMember: 'DrawingStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'DrawingStatusFk',
						model: 'DrawingStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DrawingStatusFk' },
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
