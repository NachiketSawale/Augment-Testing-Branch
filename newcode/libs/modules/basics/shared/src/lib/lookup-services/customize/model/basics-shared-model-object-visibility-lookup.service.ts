/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelObjectVisibilityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelObjectVisibilityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelObjectVisibilityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelObjectVisibilityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelobjectvisibility/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '035aeb3e7aa64e6dbf01282929f853ca',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelObjectVisibilityEntity) => x.DescriptionInfo),
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
