/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEvaluationStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEvaluationStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEvaluationStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEvaluationStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/evaluationstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5a2cfa7f9b6a4e49baa06ffa5d2cd15d',
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
						id: 'Readonly',
						model: 'Readonly',
						type: FieldType.Boolean,
						label: { text: 'Readonly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DenyDelete',
						model: 'DenyDelete',
						type: FieldType.Boolean,
						label: { text: 'DenyDelete' },
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
						id: 'NotToCount',
						model: 'NotToCount',
						type: FieldType.Boolean,
						label: { text: 'NotToCount' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
