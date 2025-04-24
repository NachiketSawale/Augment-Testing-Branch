/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeKeepingGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeKeepingGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  TimeKeepingGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeKeepingGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/company/timekeepinggroup/', endPointRead: 'listByParent', usePostForRead: true }
		}, {
			uuid: '3b1e68c69e8f409eaa63299b5b31de89',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key:'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo', key:'cloud.common.entityDescription' },
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
