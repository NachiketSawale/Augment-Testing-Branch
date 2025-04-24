/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefect2ProjectChangeTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefect2ProjectChangeTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefect2ProjectChangeTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefect2ProjectChangeTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defect2projectchangetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '068e06ea5d57476f9a351e2646f85fbc',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefect2ProjectChangeTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
