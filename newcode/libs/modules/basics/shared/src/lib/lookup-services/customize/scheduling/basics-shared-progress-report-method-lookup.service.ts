/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProgressReportMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProgressReportMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProgressReportMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProgressReportMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/progressreportmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a7beea6c77d64dc1b806154e49d8728d',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProgressReportMethodEntity) => x.DescriptionInfo),
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
