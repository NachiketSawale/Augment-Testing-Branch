/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelChangeSetStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelChangeSetStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelChangeSetStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelChangeSetStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelchangesetstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bd6ea162e10149f4a8d3eb24d6d35f20',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelChangeSetStatusEntity) => x.DescriptionInfo),
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
