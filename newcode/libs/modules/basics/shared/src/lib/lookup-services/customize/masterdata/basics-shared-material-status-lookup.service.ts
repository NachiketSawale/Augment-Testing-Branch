/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/materialstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7218f03444db4a29a1293002764fb4fe',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMaterialStatusEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isaccepted',
						model: 'Isaccepted',
						type: FieldType.Boolean,
						label: { text: 'Isaccepted' },
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
