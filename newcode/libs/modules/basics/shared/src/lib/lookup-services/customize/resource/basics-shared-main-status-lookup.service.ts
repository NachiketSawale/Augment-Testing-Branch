/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMainStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMainStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMainStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMainStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mainstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1f572eaf40544e17911e4f2805b6c5f5',
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
						id: 'Isplanned',
						model: 'Isplanned',
						type: FieldType.Boolean,
						label: { text: 'Isplanned' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isactual',
						model: 'Isactual',
						type: FieldType.Boolean,
						label: { text: 'Isactual' },
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
						id: 'IsDue',
						model: 'IsDue',
						type: FieldType.Boolean,
						label: { text: 'IsDue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TrafficLightFk',
						model: 'TrafficLightFk',
						type: FieldType.Quantity,
						label: { text: 'TrafficLightFk' },
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
					}
				]
			}
		});
	}
}
