/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRoundingMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRoundingMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRoundingMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRoundingMethodEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/roundingmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd2f9d013cf0248eaac7427a06f1c552d',
			valueMember: 'Id',
			displayMember: 'Type',
			gridConfig: {
				columns: [
					{
						id: 'Type',
						model: 'Type',
						type: FieldType.Description,
						label: { text: 'Type' },
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
