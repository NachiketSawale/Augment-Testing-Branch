/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/jobgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '40f073d2ad6f4ba68f7cbe8026a82f45',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeJobGroupEntity) => x.DescriptionInfo),
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
