/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementItemStatus2ExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementItemStatus2ExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementItemStatus2ExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementItemStatus2ExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementitemstatus2external/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd8711ed5508c4f0fad7d9b8ba0f99a33',
			valueMember: 'Id',
			displayMember: 'ItemstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ItemstatusFk',
						model: 'ItemstatusFk',
						type: FieldType.Quantity,
						label: { text: 'ItemstatusFk' },
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
