/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExternalConfigurationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExternalConfigurationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExternalConfigurationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExternalConfigurationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/externalconfiguration/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '21877c2a0c1144b49ee71ed29a237051',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeExternalConfigurationEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'Url',
						model: 'Url',
						type: FieldType.Remark,
						label: { text: 'Url' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Username',
						model: 'Username',
						type: FieldType.Comment,
						label: { text: 'Username' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Password',
						model: 'Password',
						type: FieldType.Quantity,
						label: { text: 'Password' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AuthtypeFk',
						model: 'AuthtypeFk',
						type: FieldType.Quantity,
						label: { text: 'AuthtypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Usessl',
						model: 'Usessl',
						type: FieldType.Boolean,
						label: { text: 'Usessl' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Requiretimestamp',
						model: 'Requiretimestamp',
						type: FieldType.Boolean,
						label: { text: 'Requiretimestamp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Enableencryption',
						model: 'Enableencryption',
						type: FieldType.Boolean,
						label: { text: 'Enableencryption' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Enablesignatures',
						model: 'Enablesignatures',
						type: FieldType.Boolean,
						label: { text: 'Enablesignatures' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Encryptresponse',
						model: 'Encryptresponse',
						type: FieldType.Boolean,
						label: { text: 'Encryptresponse' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FilearchivedocFk',
						model: 'FilearchivedocFk',
						type: FieldType.Quantity,
						label: { text: 'FilearchivedocFk' },
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
						id: 'EncryptiontypeFk',
						model: 'EncryptiontypeFk',
						type: FieldType.Quantity,
						label: { text: 'EncryptiontypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
