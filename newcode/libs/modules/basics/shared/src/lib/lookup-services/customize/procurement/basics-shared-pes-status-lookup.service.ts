/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePesStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePesStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPesStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePesStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/pesstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f7f5e57fc59d4a2489cd0c0130d372d8',
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
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isvirtual',
						model: 'Isvirtual',
						type: FieldType.Boolean,
						label: { text: 'Isvirtual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isinvoiced',
						model: 'Isinvoiced',
						type: FieldType.Boolean,
						label: { text: 'Isinvoiced' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Iscanceled',
						model: 'Iscanceled',
						type: FieldType.Boolean,
						label: { text: 'Iscanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isadvised',
						model: 'Isadvised',
						type: FieldType.Boolean,
						label: { text: 'Isadvised' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isstock',
						model: 'Isstock',
						type: FieldType.Boolean,
						label: { text: 'Isstock' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdelivered',
						model: 'Isdelivered',
						type: FieldType.Boolean,
						label: { text: 'Isdelivered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isprotected',
						model: 'Isprotected',
						type: FieldType.Boolean,
						label: { text: 'Isprotected' },
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
						id: 'IsRevenueRecognition',
						model: 'IsRevenueRecognition',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueRecognition' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPosted',
						model: 'IsPosted',
						type: FieldType.Boolean,
						label: { text: 'IsPosted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccepted',
						model: 'IsAccepted',
						type: FieldType.Boolean,
						label: { text: 'IsAccepted' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
