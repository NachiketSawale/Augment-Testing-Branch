/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInheritCodeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInheritCodeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInheritCodeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInheritCodeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/inheritcode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '32045f8263e64bcc92b647c8561d027f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInheritCodeEntity) => x.DescriptionInfo),
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
