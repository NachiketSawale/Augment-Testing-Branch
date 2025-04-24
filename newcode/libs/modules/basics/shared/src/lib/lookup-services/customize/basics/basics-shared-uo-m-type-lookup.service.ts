/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeUoMTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeUoMTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedUoMTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeUoMTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/uomtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ca42977b6a574a878eecc4def95afc99',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeUoMTypeEntity) => x.DescriptionInfo),
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
