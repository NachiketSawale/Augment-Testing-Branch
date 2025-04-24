/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEfbTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEfbTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEfbTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEfbTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/efbtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ba4c350a14eb4893868455d7e5389e85',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEfbTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
