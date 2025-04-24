/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionSetStatusExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionSetStatusExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionSetStatusExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionSetStatusExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionsetstatusexternal/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a15c6ec91c814eb0ae46f8c9f626e67d',
			valueMember: 'Id',
			displayMember: 'ProdSetStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ProdSetStatusFk',
						model: 'ProdSetStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ProdSetStatusFk' },
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
