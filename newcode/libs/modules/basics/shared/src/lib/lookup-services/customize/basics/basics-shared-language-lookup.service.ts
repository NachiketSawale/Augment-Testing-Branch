/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLanguageEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLanguageEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLanguageLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLanguageEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/language/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'afc462478cfc4375b57a3f02a93a4f9c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLanguageEntity) => x.DescriptionInfo),
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
						id: 'Culture',
						model: 'Culture',
						type: FieldType.Quantity,
						label: { text: 'Culture' },
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
					},
					{
						id: 'Codefinance',
						model: 'Codefinance',
						type: FieldType.Description,
						label: { text: 'Codefinance' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FbLanguageFk',
						model: 'FbLanguageFk',
						type: FieldType.Quantity,
						label: { text: 'FbLanguageFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
