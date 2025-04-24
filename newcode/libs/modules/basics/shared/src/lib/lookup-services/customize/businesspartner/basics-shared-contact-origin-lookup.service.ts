/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeContactOriginEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeContactOriginEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedContactOriginLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeContactOriginEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/contactorigin/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c471c79d788f4accbf91da9eec4c238d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeContactOriginEntity) => x.DescriptionInfo),
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
