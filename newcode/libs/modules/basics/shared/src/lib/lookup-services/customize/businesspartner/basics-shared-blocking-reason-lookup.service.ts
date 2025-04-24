/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBlockingReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBlockingReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBlockingReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBlockingReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/blockingreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a304cf38ebe047568b1de7e44e3db6d8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBlockingReasonEntity) => x.DescriptionInfo),
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
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { text: 'Reference' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined01',
						model: 'UserDefined01',
						type: FieldType.Description,
						label: { text: 'UserDefined01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined02',
						model: 'UserDefined02',
						type: FieldType.Description,
						label: { text: 'UserDefined02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined03',
						model: 'UserDefined03',
						type: FieldType.Description,
						label: { text: 'UserDefined03' },
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
