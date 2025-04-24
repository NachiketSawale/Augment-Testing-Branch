/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeResourcePartTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeResourcePartTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedResourcePartTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeResourcePartTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/resourceparttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd0a93b6d9d9e482dbb28f158dc31784c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeResourcePartTypeEntity) => x.DescriptionInfo),
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
						id: 'ShortKeyInfo',
						model: 'ShortKeyInfo',
						type: FieldType.Translation,
						label: { text: 'ShortKeyInfo' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
