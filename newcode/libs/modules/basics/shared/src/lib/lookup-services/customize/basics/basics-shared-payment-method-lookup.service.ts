/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePaymentMethodEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePaymentMethodEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPaymentMethodLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePaymentMethodEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/paymentmethod/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '23426f5b6e634cc2a070f83ad080424f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePaymentMethodEntity) => x.DescriptionInfo),
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
