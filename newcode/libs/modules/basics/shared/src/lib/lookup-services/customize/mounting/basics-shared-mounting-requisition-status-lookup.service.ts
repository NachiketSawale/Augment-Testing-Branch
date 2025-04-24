/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMountingRequisitionStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMountingRequisitionStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMountingRequisitionStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMountingRequisitionStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mountingrequisitionstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '186efef6d0b0462f8835e11a2d7d5398',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
						id: 'Isdeleteable',
						model: 'Isdeleteable',
						type: FieldType.Boolean,
						label: { text: 'Isdeleteable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag1',
						model: 'Userflag1',
						type: FieldType.Boolean,
						label: { text: 'Userflag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag2',
						model: 'Userflag2',
						type: FieldType.Boolean,
						label: { text: 'Userflag2' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
