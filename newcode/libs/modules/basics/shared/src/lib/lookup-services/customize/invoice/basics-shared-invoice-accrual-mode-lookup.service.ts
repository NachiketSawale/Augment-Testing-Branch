/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceAccrualModeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceAccrualModeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceAccrualModeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceAccrualModeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/invoiceaccrualmode/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f1fd01cd3057479fbe2aeec1ee0e02a7',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInvoiceAccrualModeEntity) => x.DescriptionInfo),
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
						id: 'Abbreviation',
						model: 'Abbreviation',
						type: FieldType.Code,
						label: { text: 'Abbreviation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
