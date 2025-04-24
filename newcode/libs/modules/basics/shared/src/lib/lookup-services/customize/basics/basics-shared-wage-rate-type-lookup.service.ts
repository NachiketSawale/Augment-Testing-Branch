/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWageRateTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWageRateTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWageRateTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWageRateTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/wageratetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8cedcd31b2d549e996e4da139fb9a6dd',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWageRateTypeEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
