/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWfeWorkflowTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWfeWorkflowTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWfeWorkflowTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWfeWorkflowTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/wfeworkflowtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '04d5e6276297417fbf1dfd0bf2fff361',
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
