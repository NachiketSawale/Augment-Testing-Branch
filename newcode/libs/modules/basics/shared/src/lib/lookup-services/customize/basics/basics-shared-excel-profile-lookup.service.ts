/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExcelProfileEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExcelProfileEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExcelProfileLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExcelProfileEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/excelprofile/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd037adc78bbd4b2b8df65d661b37bbb2',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeExcelProfileEntity) => x.DescriptionInfo),
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
						id: 'ProfileContext',
						model: 'ProfileContext',
						type: FieldType.Quantity,
						label: { text: 'ProfileContext' },
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
