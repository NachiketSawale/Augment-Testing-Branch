/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsFilterHierarchyEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsFilterHierarchyEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsFilterHierarchyLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsFilterHierarchyEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsfilterhierarchy/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '141f498de4fc4aa181a18921e5c9f1c7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsFilterHierarchyEntity) => x.DescriptionInfo),
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
