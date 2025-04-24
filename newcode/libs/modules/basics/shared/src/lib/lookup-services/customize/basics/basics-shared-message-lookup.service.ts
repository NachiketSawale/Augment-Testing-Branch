/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMessageEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMessageEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMessageLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMessageEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/message/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0846de34c8ce4ce7ba58c651f6ccfbe8',
			valueMember: 'Id',
			displayMember: 'Message',
			gridConfig: {
				columns: [
					{
						id: 'MessageInfo',
						model: 'MessageInfo',
						type: FieldType.Translation,
						label: { text: 'MessageInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ParameterCount',
						model: 'ParameterCount',
						type: FieldType.Quantity,
						label: { text: 'ParameterCount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MessageseverityFk',
						model: 'MessageseverityFk',
						type: FieldType.Quantity,
						label: { text: 'MessageseverityFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
