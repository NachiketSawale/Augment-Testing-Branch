/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAddressFormatEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAddressFormatEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAddressFormatLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAddressFormatEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/addressformat/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '48e37bddf17d4ab6b58e54a93b516419',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAddressFormatEntity) => x.DescriptionInfo),
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
						id: 'Template',
						model: 'Template',
						type: FieldType.Comment,
						label: { text: 'Template' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Linetemplate',
						model: 'Linetemplate',
						type: FieldType.Comment,
						label: { text: 'Linetemplate' },
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
