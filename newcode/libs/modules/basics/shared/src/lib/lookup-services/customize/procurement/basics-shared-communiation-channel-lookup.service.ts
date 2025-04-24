/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCommuniationChannelEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCommuniationChannelEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCommuniationChannelLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCommuniationChannelEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/communiationchannel/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bf879bd82c964a8ba062e96f63dbb95c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeCommuniationChannelEntity) => x.DescriptionInfo),
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
