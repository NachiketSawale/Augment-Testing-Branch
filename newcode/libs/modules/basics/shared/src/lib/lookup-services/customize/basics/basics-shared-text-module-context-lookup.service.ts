/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextModuleContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextModuleContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextModuleContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextModuleContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/textmodulecontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e0bc5374e2654a2f93e8037017876a0b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTextModuleContextEntity) => x.DescriptionInfo),
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
