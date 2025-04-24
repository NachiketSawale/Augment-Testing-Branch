/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqCatalogEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqCatalogEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqCatalogLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqCatalogEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqcatalog/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '95540de802f046718e40cbe57ca03433',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqCatalogEntity) => x.DescriptionInfo),
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
						id: 'AssignedCol',
						model: 'AssignedCol',
						type: FieldType.Description,
						label: { text: 'AssignedCol' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasProjectRef',
						model: 'HasProjectRef',
						type: FieldType.Boolean,
						label: { text: 'HasProjectRef' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
