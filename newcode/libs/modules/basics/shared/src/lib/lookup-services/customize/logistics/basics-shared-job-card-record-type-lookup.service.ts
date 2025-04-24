/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobCardRecordTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobCardRecordTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobCardRecordTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobCardRecordTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/jobcardrecordtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3b580f6deb474ccdb7267ca4b296e43b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeJobCardRecordTypeEntity) => x.DescriptionInfo),
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
