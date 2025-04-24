/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReqStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReqStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReqStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReqStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/reqstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '15d4878e9dff47a882c84ea49dd87c89',
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
						id: 'Isaccepted',
						model: 'Isaccepted',
						type: FieldType.Boolean,
						label: { text: 'Isaccepted' },
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
						id: 'Ispublished',
						model: 'Ispublished',
						type: FieldType.Boolean,
						label: { text: 'Ispublished' },
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
						id: 'Isrevised',
						model: 'Isrevised',
						type: FieldType.Boolean,
						label: { text: 'Isrevised' },
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
