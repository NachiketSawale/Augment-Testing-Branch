/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeConditionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeConditionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedConditionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeConditionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/conditiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7b3a779f9d434200bdf501ed25c46b60',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeConditionTypeEntity) => x.DescriptionInfo),
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
