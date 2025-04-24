/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePesStatus2ExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePesStatus2ExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPesStatus2ExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePesStatus2ExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/pesstatus2external/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '481947a6cd664005bbf4fd00a61db9be',
			valueMember: 'Id',
			displayMember: 'StatusFk',
			gridConfig: {
				columns: [
					{
						id: 'StatusFk',
						model: 'StatusFk',
						type: FieldType.Quantity,
						label: { text: 'StatusFk' },
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
