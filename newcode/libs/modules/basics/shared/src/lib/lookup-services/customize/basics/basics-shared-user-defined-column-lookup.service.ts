/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeUserDefinedColumnEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeUserDefinedColumnEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedUserDefinedColumnLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeUserDefinedColumnEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/userdefinedcolumn/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '197a12c22ba9483298f291c8ee597a96',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Quantity,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
