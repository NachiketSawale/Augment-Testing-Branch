/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductStatus2ExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductStatus2ExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductStatus2ExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductStatus2ExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductstatus2external/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'cbb40693e61f4737b7ed60a2f84d7e51',
			valueMember: 'Id',
			displayMember: 'ProductStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ProductStatusFk',
						model: 'ProductStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ProductStatusFk' },
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
