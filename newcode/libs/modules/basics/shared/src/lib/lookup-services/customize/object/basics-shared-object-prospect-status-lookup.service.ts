/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectProspectStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectProspectStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectProspectStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectProspectStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectprospectstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f85f3898950944708ee43c4c6dc3171c',
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
					}
				]
			}
		});
	}
}
