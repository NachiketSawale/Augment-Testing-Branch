/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/orderstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f29cc43a096f41e6aa8970d19dfbca8a',
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
						id: 'ReadOnly',
						model: 'ReadOnly',
						type: FieldType.Boolean,
						label: { text: 'ReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsOrdered',
						model: 'IsOrdered',
						type: FieldType.Boolean,
						label: { text: 'IsOrdered' },
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
						id: 'IsCanceled',
						model: 'IsCanceled',
						type: FieldType.Boolean,
						label: { text: 'IsCanceled' },
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
						id: 'IsFinallyBilled',
						model: 'IsFinallyBilled',
						type: FieldType.Boolean,
						label: { text: 'IsFinallyBilled' },
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
					}
				]
			}
		});
	}
}
