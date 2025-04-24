/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfIGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfIGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfIGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfIGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rfigroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '95570b08eb154e3bac1f5a17d6e5d294',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRfIGroupEntity) => x.DescriptionInfo),
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
