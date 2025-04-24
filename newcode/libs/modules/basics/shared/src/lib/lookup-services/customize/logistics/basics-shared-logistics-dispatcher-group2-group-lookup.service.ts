/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsDispatcherGroup2GroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticsdispatchergroup2group/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '40b25533574a490a971377d80652e011',
			valueMember: 'Id',
			displayMember: 'DispatcherGroupFk',
			gridConfig: {
				columns: [
					{
						id: 'DispatcherGroupFk',
						model: 'DispatcherGroupFk',
						type: FieldType.Quantity,
						label: { text: 'DispatcherGroupFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DispatcherGroupToFk',
						model: 'DispatcherGroupToFk',
						type: FieldType.Quantity,
						label: { text: 'DispatcherGroupToFk' },
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
