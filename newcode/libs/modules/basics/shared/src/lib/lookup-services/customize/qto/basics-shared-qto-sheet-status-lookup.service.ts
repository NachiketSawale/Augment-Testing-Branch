/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoSheetStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoSheetStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoSheetStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoSheetStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtosheetstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e532e59246874f4a87532ae15a27bb67',
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefaultExt',
						model: 'IsDefaultExt',
						type: FieldType.Boolean,
						label: { text: 'IsDefaultExt' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCoreData',
						model: 'IsCoreData',
						type: FieldType.Boolean,
						label: { text: 'IsCoreData' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCoreDataExt',
						model: 'IsCoreDataExt',
						type: FieldType.Boolean,
						label: { text: 'IsCoreDataExt' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDisable',
						model: 'IsDisable',
						type: FieldType.Boolean,
						label: { text: 'IsDisable' },
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
					}
				]
			}
		});
	}
}
