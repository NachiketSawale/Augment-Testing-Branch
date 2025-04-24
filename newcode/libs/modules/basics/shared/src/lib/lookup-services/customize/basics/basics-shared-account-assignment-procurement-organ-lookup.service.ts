/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountAssignmentProcurementOrganEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountAssignmentProcurementOrganEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountAssignmentProcurementOrganLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountAssignmentProcurementOrganEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountassignmentprocurementorgan/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2eccfb1dbeb840cf9573e20be2186f80',
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
