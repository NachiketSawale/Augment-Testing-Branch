/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingCatEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingCatEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingCatLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingCatEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/controllingcat/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e26b4f0bb921433ca7c7062dad86705c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeControllingCatEntity) => x.DescriptionInfo),
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
