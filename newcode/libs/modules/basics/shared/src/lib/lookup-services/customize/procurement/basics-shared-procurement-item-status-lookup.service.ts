/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProcurementItemStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProcurementItemStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProcurementItemStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProcurementItemStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/procurementitemstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4deb784a2c0e402889b1791b5b9e8984',
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
						id: 'Isdelivered',
						model: 'Isdelivered',
						type: FieldType.Boolean,
						label: { text: 'Isdelivered' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ispartdelivered',
						model: 'Ispartdelivered',
						type: FieldType.Boolean,
						label: { text: 'Ispartdelivered' },
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
						id: 'Isaccepted',
						model: 'Isaccepted',
						type: FieldType.Boolean,
						label: { text: 'Isaccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ispartaccepted',
						model: 'Ispartaccepted',
						type: FieldType.Boolean,
						label: { text: 'Ispartaccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isrejected',
						model: 'Isrejected',
						type: FieldType.Boolean,
						label: { text: 'Isrejected' },
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
