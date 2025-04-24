/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimeSheetContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimeSheetContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimeSheetContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimeSheetContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timesheetcontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7bb9369852264d96b5462c43d354ef93',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimeSheetContextEntity) => x.DescriptionInfo),
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
