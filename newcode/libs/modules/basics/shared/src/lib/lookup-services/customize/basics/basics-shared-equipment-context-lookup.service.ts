/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentContextEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/equipmentcontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '845f70fa090f42cbb30255df14e37ae5',
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
