/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingRecordingStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingRecordingStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingRecordingStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingRecordingStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/timekeepingrecordingstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6c94d1702d6846daa5e32bf2c0dada99',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsApproved',
						model: 'IsApproved',
						type: FieldType.Boolean,
						label: { text: 'IsApproved' },
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
