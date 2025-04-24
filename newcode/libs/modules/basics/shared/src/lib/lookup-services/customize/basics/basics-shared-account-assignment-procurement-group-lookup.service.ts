/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountAssignmentProcurementGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountAssignmentProcurementGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountAssignmentProcurementGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountAssignmentProcurementGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountassignmentprocurementgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '128eea37e896477f84b9b8a1e8de30db',
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
