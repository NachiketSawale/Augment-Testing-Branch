/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';

import { IBasicsCustomizeSiteEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSiteEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSiteLookupService<T extends object> extends UiCommonLookupTypeDataService<IBasicsCustomizeSiteEntity, T>  {
	public constructor() {
		super('SiteNew', {
			uuid: '1f9f5c1deaa249068b43712a3d8f3eee',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'Description',
						model: 'DescriptionInfo.Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			treeConfig: {
				parentMember: 'SiteFk',
				childMember: 'ChildItems',
				collapsed: false,
			},
		});

	}
}
