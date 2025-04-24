/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c13e08909b7c47ffa3011a6d8f12fdd5',
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsoptionalDownwards',
						model: 'IsoptionalDownwards',
						type: FieldType.Boolean,
						label: { text: 'IsoptionalDownwards' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsoptionalUpwards',
						model: 'IsoptionalUpwards',
						type: FieldType.Boolean,
						label: { text: 'IsoptionalUpwards' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isbid',
						model: 'Isbid',
						type: FieldType.Boolean,
						label: { text: 'Isbid' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isexecution',
						model: 'Isexecution',
						type: FieldType.Boolean,
						label: { text: 'Isexecution' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iscontract',
						model: 'Iscontract',
						type: FieldType.Boolean,
						label: { text: 'Iscontract' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iswarranty',
						model: 'Iswarranty',
						type: FieldType.Boolean,
						label: { text: 'Iswarranty' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MessageInfo',
						model: 'MessageInfo',
						type: FieldType.Translation,
						label: { text: 'MessageInfo' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
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
					}
				]
			}
		});
	}
}
