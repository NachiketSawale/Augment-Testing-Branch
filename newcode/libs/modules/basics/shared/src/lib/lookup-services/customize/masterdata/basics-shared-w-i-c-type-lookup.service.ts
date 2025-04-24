/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWICTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWICTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWICTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWICTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/wictype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8ce90215d77e4967ac3f16e32db72a0b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWICTypeEntity) => x.DescriptionInfo),
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
						id: 'IsFramework',
						model: 'IsFramework',
						type: FieldType.Boolean,
						label: { text: 'IsFramework' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
