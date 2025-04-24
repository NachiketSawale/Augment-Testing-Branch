/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeConStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeConStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedConStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeConStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/constatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '43b18bd1ed4940ff979f9087b0e0c063',
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
						id: 'Iscanceled',
						model: 'Iscanceled',
						type: FieldType.Boolean,
						label: { text: 'Iscanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isreported',
						model: 'Isreported',
						type: FieldType.Boolean,
						label: { text: 'Isreported' },
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
						id: 'IsoptionalUpwards',
						model: 'IsoptionalUpwards',
						type: FieldType.Boolean,
						label: { text: 'IsoptionalUpwards' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsoptionalDownwards',
						model: 'IsoptionalDownwards',
						type: FieldType.Boolean,
						label: { text: 'IsoptionalDownwards' },
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
						id: 'Isinvoiced',
						model: 'Isinvoiced',
						type: FieldType.Boolean,
						label: { text: 'Isinvoiced' },
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
						id: 'Ischangsent',
						model: 'Ischangsent',
						type: FieldType.Boolean,
						label: { text: 'Ischangsent' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ischangeaccepted',
						model: 'Ischangeaccepted',
						type: FieldType.Boolean,
						label: { text: 'Ischangeaccepted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Ischangerejected',
						model: 'Ischangerejected',
						type: FieldType.Boolean,
						label: { text: 'Ischangerejected' },
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
						id: 'IsUpdateImport',
						model: 'IsUpdateImport',
						type: FieldType.Boolean,
						label: { text: 'IsUpdateImport' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPesCO',
						model: 'IsPesCO',
						type: FieldType.Boolean,
						label: { text: 'IsPesCO' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
