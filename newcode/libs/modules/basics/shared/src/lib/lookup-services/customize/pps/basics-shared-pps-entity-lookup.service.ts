/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsEntityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsEntityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsEntityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsEntityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsentity/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4a94075b142d4461ab019b35ad6278a8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsEntityEntity) => x.DescriptionInfo),
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
						id: 'Foreventtype',
						model: 'Foreventtype',
						type: FieldType.Boolean,
						label: { text: 'Foreventtype' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
