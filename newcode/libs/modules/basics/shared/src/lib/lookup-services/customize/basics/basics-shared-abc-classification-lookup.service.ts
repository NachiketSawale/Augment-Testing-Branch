/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAbcClassificationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAbcClassificationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAbcClassificationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAbcClassificationEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/abcclassification/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '14620a76150c4582a4f819c7b1b57034',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAbcClassificationEntity) => x.DescriptionInfo),
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
