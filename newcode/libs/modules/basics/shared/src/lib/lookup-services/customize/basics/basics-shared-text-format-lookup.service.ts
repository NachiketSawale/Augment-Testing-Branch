/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextFormatEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextFormatEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextFormatLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextFormatEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/textformat/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2b97d3d2ba8f4a7b876fc3b03d50c24c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTextFormatEntity) => x.DescriptionInfo),
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
