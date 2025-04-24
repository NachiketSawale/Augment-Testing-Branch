/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBaselineSpecEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBaselineSpecEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBaselineSpecLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBaselineSpecEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/baselinespec/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4035fab99860479ea6a6f0f8c27906f6',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
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
						id: 'CompanyFk',
						model: 'CompanyFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
