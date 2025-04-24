/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCertificateStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCertificateStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCertificateStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/certificatestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '82149a5f65d242da84d4a309fbe0d30b',
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
						id: 'IsoptionalDownwards',
						model: 'IsoptionalDownwards',
						type: FieldType.Boolean,
						label: { text: 'IsoptionalDownwards' },
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
						id: 'Isrequest',
						model: 'Isrequest',
						type: FieldType.Boolean,
						label: { text: 'Isrequest' },
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
						id: 'Isescalation',
						model: 'Isescalation',
						type: FieldType.Boolean,
						label: { text: 'Isescalation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CertificatestatusFk',
						model: 'CertificatestatusFk',
						type: FieldType.Quantity,
						label: { text: 'CertificatestatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Increaseafterdays',
						model: 'Increaseafterdays',
						type: FieldType.Quantity,
						label: { text: 'Increaseafterdays' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RemindertextInfo',
						model: 'RemindertextInfo',
						type: FieldType.Translation,
						label: { text: 'RemindertextInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
