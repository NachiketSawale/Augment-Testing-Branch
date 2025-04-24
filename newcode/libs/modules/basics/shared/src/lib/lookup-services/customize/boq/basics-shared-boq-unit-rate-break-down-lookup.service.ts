/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqUnitRateBreakDownEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqUnitRateBreakDownEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqUnitRateBreakDownLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqUnitRateBreakDownEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/boqunitratebreakdown/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '79c04473946144c781c9eff6bbb71c99',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBoqUnitRateBreakDownEntity) => x.DescriptionInfo),
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
