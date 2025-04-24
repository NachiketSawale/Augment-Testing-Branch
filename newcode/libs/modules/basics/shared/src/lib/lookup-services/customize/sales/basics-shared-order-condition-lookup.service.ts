/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderConditionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderConditionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderConditionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderConditionEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ordercondition/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '27e5981b668c401796bde9cc0c234e14',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeOrderConditionEntity) => x.DescriptionInfo),
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
