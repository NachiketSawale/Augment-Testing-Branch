/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextAreaEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextAreaEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextAreaLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextAreaEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/textarea/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3722d20c6cac4bf4b280adc54ea57ec4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTextAreaEntity) => x.DescriptionInfo),
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
