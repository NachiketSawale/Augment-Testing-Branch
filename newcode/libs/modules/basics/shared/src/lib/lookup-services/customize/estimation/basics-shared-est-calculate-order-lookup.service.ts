/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstCalculateOrderEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstCalculateOrderEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstCalculateOrderLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstCalculateOrderEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/estcalculateorder/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '28d6a90742c84ab3b2eac4d71a2176d0',
			valueMember: 'Id',
			displayMember: 'Operation',
			gridConfig: {
				columns: [
					{
						id: 'Operation',
						model: 'Operation',
						type: FieldType.Comment,
						label: { text: 'Operation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCostTotal',
						model: 'IsCostTotal',
						type: FieldType.Boolean,
						label: { text: 'IsCostTotal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SortOrder',
						model: 'SortOrder',
						type: FieldType.Quantity,
						label: { text: 'SortOrder' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
