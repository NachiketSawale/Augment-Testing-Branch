/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResResourceKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResResourceKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResResourceKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResResourceKindEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/resresourcekind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8c6a1c7eae454b17ac65d0a9160d30d4',
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
						id: 'ShortKeyInfo',
						model: 'ShortKeyInfo',
						type: FieldType.Translation,
						label: { text: 'ShortKeyInfo' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ispoolresource',
						model: 'Ispoolresource',
						type: FieldType.Boolean,
						label: { text: 'Ispoolresource' },
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
						id: 'IsHired',
						model: 'IsHired',
						type: FieldType.Boolean,
						label: { text: 'IsHired' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
