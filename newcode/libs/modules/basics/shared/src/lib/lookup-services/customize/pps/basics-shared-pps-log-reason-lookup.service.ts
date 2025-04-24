/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsLogReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsLogReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsLogReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsLogReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppslogreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b29c72bb35ca45a3aaee86e89eab4ff7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsLogReasonEntity) => x.DescriptionInfo),
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
						id: 'LogReasonGroupFk',
						model: 'LogReasonGroupFk',
						type: FieldType.Quantity,
						label: { text: 'LogReasonGroupFk' },
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
