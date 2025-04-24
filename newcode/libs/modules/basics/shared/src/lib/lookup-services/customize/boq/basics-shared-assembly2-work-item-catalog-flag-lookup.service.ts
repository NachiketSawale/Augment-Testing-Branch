/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAssembly2WorkItemCatalogFlagLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/assembly2workitemcatalogflag/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '59a1ab51ea3a42dda2500de5c5d9af0f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity) => x.DescriptionInfo),
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
