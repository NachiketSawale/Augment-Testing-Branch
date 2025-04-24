/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqRejectionReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqRejectionReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqRejectionReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqRejectionReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rfqrejectionreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7cd9ed0412c546d1b6396b5102e33c9c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRfqRejectionReasonEntity) => x.DescriptionInfo),
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
						id: 'TextModuleFk',
						model: 'TextModuleFk',
						type: FieldType.Quantity,
						label: { text: 'TextModuleFk' },
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
