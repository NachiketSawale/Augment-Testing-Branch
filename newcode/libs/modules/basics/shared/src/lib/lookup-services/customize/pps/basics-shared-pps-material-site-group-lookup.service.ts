/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsMaterialSiteGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsMaterialSiteGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsMaterialSiteGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsMaterialSiteGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsmaterialsitegroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '374ca04c00c846a298bd9e38c8d6b622',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsMaterialSiteGroupEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'IsDeletable',
						model: 'IsDeletable',
						type: FieldType.Boolean,
						label: { text: 'IsDeletable' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag1',
						model: 'UserFlag1',
						type: FieldType.Boolean,
						label: { text: 'UserFlag1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFlag2',
						model: 'UserFlag2',
						type: FieldType.Boolean,
						label: { text: 'UserFlag2' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
