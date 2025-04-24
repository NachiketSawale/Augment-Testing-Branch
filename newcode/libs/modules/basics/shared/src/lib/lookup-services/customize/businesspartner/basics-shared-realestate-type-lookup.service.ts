/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRealestateTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRealestateTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRealestateTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRealestateTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/realestatetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5b1de641dc3a42fb88e76ce3a5ac1964',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRealestateTypeEntity) => x.DescriptionInfo),
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
