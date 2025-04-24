/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/rfqstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9f073afe388a43a09cf757201b9d59ef',
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
						id: 'Isadvertised',
						model: 'Isadvertised',
						type: FieldType.Boolean,
						label: { text: 'Isadvertised' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isquoted',
						model: 'Isquoted',
						type: FieldType.Boolean,
						label: { text: 'Isquoted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isordered',
						model: 'Isordered',
						type: FieldType.Boolean,
						label: { text: 'Isordered' },
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
						id: 'Iscanceled',
						model: 'Iscanceled',
						type: FieldType.Boolean,
						label: { text: 'Iscanceled' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBaselineUpdateInvalid',
						model: 'IsBaselineUpdateInvalid',
						type: FieldType.Boolean,
						label: { text: 'IsBaselineUpdateInvalid' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
