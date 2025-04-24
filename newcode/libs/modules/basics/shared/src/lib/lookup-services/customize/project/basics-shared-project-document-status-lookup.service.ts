/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectDocumentStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectDocumentStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectDocumentStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectDocumentStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/projectdocumentstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bf1d249ee7d943ec8f76cdf5aad3f012',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinternalonly',
						model: 'Isinternalonly',
						type: FieldType.Boolean,
						label: { text: 'Isinternalonly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isvirtual',
						model: 'Isvirtual',
						type: FieldType.Boolean,
						label: { text: 'Isvirtual' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefaultNewRevision',
						model: 'IsDefaultNewRevision',
						type: FieldType.Boolean,
						label: { text: 'IsDefaultNewRevision' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefaultDeleteRevision',
						model: 'IsDefaultDeleteRevision',
						type: FieldType.Boolean,
						label: { text: 'IsDefaultDeleteRevision' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
