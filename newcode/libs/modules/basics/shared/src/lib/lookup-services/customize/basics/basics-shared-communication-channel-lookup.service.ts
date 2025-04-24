/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCommunicationChannelEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCommunicationChannelEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCommunicationChannelLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCommunicationChannelEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/communicationchannel/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '15e52dc8971a4ae1932657de627d89b7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCommunicationChannelEntity) => x.DescriptionInfo),
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
