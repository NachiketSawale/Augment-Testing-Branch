/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRoundToEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRoundToEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRoundToLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRoundToEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/roundto/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8408eb2b929c43968bfa14db90279b10',
			valueMember: 'Id',
			displayMember: 'RoundTo',
			gridConfig: {
				columns: [
					{
						id: 'RoundTo',
						model: 'RoundTo',
						type: FieldType.Description,
						label: { text: 'RoundTo' },
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
