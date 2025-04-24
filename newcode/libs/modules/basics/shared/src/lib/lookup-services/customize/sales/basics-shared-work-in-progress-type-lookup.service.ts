/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeWorkInProgressTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeWorkInProgressTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedWorkInProgressTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeWorkInProgressTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/workinprogresstype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '93204e7c6a81472b939b6662089320cc',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeWorkInProgressTypeEntity) => x.DescriptionInfo),
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
