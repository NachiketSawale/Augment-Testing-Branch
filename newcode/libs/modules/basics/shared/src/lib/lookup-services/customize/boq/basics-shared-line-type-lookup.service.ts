/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLineTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLineTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLineTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLineTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/linetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '01a218a8185447deac881a5db568b4fd',
			valueMember: 'Id',
			displayMember: 'Code',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLineTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Translation,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
