/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvRejectionReasonEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvRejectionReasonEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvRejectionReasonLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvRejectionReasonEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/invrejectionreason/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a4b0182904fa4b33b532c85836ba157f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInvRejectionReasonEntity) => x.DescriptionInfo),
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
					},
					{
						id: 'Isawaitingcreditnote',
						model: 'Isawaitingcreditnote',
						type: FieldType.Boolean,
						label: { text: 'Isawaitingcreditnote' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
