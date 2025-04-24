/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEMailServerEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEMailServerEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEMailServerLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEMailServerEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/emailserver/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6736077ce0af462982051103afc2468a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEMailServerEntity) => x.DescriptionInfo),
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
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Description,
						label: { text: 'Remark' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ServerUrl',
						model: 'ServerUrl',
						type: FieldType.Remark,
						label: { text: 'ServerUrl' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UseAuthentication',
						model: 'UseAuthentication',
						type: FieldType.Boolean,
						label: { text: 'UseAuthentication' },
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
						id: 'EncryptionTypeFk',
						model: 'EncryptionTypeFk',
						type: FieldType.Quantity,
						label: { text: 'EncryptionTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SecurityType',
						model: 'SecurityType',
						type: FieldType.Quantity,
						label: { text: 'SecurityType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Port',
						model: 'Port',
						type: FieldType.Quantity,
						label: { text: 'Port' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SenderEmail',
						model: 'SenderEmail',
						type: FieldType.Comment,
						label: { text: 'SenderEmail' },
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
					}
				]
			}
		});
	}
}
