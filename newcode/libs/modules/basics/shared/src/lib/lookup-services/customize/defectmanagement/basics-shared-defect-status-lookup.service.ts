/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/defectstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '658e60d1437b4226b595f44c58d03388',
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
					},
					{
						id: 'Accessrightdescriptor',
						model: 'Accessrightdescriptor',
						type: FieldType.Quantity,
						label: { text: 'Accessrightdescriptor' },
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
						id: 'AccessRightDescriptor1Fk',
						model: 'AccessRightDescriptor1Fk',
						type: FieldType.Quantity,
						label: { text: 'AccessRightDescriptor1Fk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
