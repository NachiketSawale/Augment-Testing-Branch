/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWageGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWageGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWageGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWageGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/wagegroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '995a019347bd4aa4ae009e6b7ee94b61',
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WageRateTypeFk',
						model: 'WageRateTypeFk',
						type: FieldType.Quantity,
						label: { text: 'WageRateTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Group',
						model: 'Group',
						type: FieldType.Code,
						label: { text: 'Group' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkupRate',
						model: 'MarkupRate',
						type: FieldType.Quantity,
						label: { text: 'MarkupRate' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
