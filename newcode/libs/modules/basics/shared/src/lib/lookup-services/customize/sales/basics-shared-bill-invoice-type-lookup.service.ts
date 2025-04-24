/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBillInvoiceTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBillInvoiceTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBillInvoiceTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBillInvoiceTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/billinvoicetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a27a90cc4340421daacdcca23adc4848',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeBillInvoiceTypeEntity) => x.DescriptionInfo),
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
						id: 'IsLumpSum',
						model: 'IsLumpSum',
						type: FieldType.Boolean,
						label: { text: 'IsLumpSum' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
