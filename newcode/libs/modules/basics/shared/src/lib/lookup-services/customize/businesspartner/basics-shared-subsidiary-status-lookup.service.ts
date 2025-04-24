/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSubsidiaryStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSubsidiaryStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSubsidiaryStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSubsidiaryStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/subsidiarystatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7ae03f602b674bea9010a4b809c04636',
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
						id: 'IsActive',
						model: 'IsActive',
						type: FieldType.Boolean,
						label: { text: 'IsActive' },
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
					}
				]
			}
		});
	}
}
