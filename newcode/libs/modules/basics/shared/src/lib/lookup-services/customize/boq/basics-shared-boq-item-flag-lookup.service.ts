/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqItemFlagEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqItemFlagEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqItemFlagLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqItemFlagEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/boqitemflag/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '45d2c9f2cf8d4248bcdce09832e1c485',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
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
					},
					{
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark' },
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
