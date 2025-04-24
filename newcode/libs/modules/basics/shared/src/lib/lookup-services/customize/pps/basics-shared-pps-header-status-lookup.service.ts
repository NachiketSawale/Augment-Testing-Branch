/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsHeaderStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsHeaderStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsHeaderStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsHeaderStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsheaderstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c8174d5c4f2846dfa92ee301dfedbd80',
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
						id: 'Backgroundcolor',
						model: 'Backgroundcolor',
						type: FieldType.Quantity,
						label: { text: 'Backgroundcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Fontcolor',
						model: 'Fontcolor',
						type: FieldType.Quantity,
						label: { text: 'Fontcolor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinproduction',
						model: 'Isinproduction',
						type: FieldType.Boolean,
						label: { text: 'Isinproduction' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdeletable',
						model: 'Isdeletable',
						type: FieldType.Boolean,
						label: { text: 'Isdeletable' },
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
