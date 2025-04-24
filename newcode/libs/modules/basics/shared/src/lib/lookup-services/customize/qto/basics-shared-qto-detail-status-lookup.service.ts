/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeQtoDetailStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeQtoDetailStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedQtoDetailStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeQtoDetailStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/qtodetailstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5b6483e7cdc74eb589269ddc088d2948',
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
						id: 'IsDefaulExt',
						model: 'IsDefaulExt',
						type: FieldType.Boolean,
						label: { text: 'IsDefaulExt' },
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
						id: 'IsOk',
						model: 'IsOk',
						type: FieldType.Boolean,
						label: { text: 'IsOk' },
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
