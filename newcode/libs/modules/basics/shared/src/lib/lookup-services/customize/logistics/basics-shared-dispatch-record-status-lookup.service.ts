/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchRecordStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchRecordStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchRecordStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchRecordStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchrecordstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1f7b14a898a84e6d9c33da6130395144',
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
						id: 'IsPicked',
						model: 'IsPicked',
						type: FieldType.Boolean,
						label: { text: 'IsPicked' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDelivered',
						model: 'IsDelivered',
						type: FieldType.Boolean,
						label: { text: 'IsDelivered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInvoiced',
						model: 'IsInvoiced',
						type: FieldType.Boolean,
						label: { text: 'IsInvoiced' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCanceled',
						model: 'IsCanceled',
						type: FieldType.Boolean,
						label: { text: 'IsCanceled' },
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
					},
					{
						id: 'Hasissuedetected',
						model: 'Hasissuedetected',
						type: FieldType.Boolean,
						label: { text: 'Hasissuedetected' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
