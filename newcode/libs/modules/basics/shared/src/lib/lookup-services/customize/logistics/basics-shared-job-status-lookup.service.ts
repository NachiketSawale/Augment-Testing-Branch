/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/jobstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b73326789abb427cb5b1392ded681dae',
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
						id: 'Isadvised',
						model: 'Isadvised',
						type: FieldType.Boolean,
						label: { text: 'Isadvised' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isfixed',
						model: 'Isfixed',
						type: FieldType.Boolean,
						label: { text: 'Isfixed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isrejected',
						model: 'Isrejected',
						type: FieldType.Boolean,
						label: { text: 'Isrejected' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iscanceled',
						model: 'Iscanceled',
						type: FieldType.Boolean,
						label: { text: 'Iscanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
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
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
