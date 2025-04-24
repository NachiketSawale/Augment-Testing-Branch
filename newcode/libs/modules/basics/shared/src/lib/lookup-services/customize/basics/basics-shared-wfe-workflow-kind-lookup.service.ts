/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWfeWorkflowKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWfeWorkflowKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWfeWorkflowKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWfeWorkflowKindEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/wfeworkflowkind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b5e0d46ea0cc4f979100e991dc926fbb',
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
