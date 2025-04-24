/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingRequisitionStatusExternalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingRequisitionStatusExternalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingRequisitionStatusExternalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingRequisitionStatusExternalEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingrequisitionstatusexternal/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '75de0ddefc9d4b48b3f96d8bdcfbbd42',
			valueMember: 'Id',
			displayMember: 'ReqStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'ReqStatusFk',
						model: 'ReqStatusFk',
						type: FieldType.Quantity,
						label: { text: 'ReqStatusFk' },
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
