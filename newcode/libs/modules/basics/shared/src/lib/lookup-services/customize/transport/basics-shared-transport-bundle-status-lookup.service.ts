/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportBundleStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportBundleStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportBundleStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportBundleStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportbundlestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'fead7fca259549b8bd79c7894f6ce5cc',
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Dispatchable',
						model: 'Dispatchable',
						type: FieldType.Boolean,
						label: { text: 'Dispatchable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag1',
						model: 'Userflag1',
						type: FieldType.Boolean,
						label: { text: 'Userflag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userflag2',
						model: 'Userflag2',
						type: FieldType.Boolean,
						label: { text: 'Userflag2' },
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
						id: 'IsDone',
						model: 'IsDone',
						type: FieldType.Boolean,
						label: { text: 'IsDone' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
