/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMeetingTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMeetingTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMeetingTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMeetingTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/meetingtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ab7a31369a834af5ae27f18adb1b0a96',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMeetingTypeEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
