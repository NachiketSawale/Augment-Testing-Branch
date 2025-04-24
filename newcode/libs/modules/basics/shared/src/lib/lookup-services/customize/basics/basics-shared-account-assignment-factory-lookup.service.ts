/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountAssignmentFactoryEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountAssignmentFactoryEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountAssignmentFactoryLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountAssignmentFactoryEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountassignmentfactory/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3c911d1a1425491385ca1abc4f12cc2c',
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
