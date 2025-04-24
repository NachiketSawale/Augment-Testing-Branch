/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePrcStockTransactionTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePrcStockTransactionTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPrcStockTransactionTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePrcStockTransactionTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/prcstocktransactiontype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '54acaefd631042e3a9040bdf11b590cd',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePrcStockTransactionTypeEntity) => x.DescriptionInfo),
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
						id: 'IsAllowedManual',
						model: 'IsAllowedManual',
						type: FieldType.Boolean,
						label: { text: 'IsAllowedManual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReceipt',
						model: 'IsReceipt',
						type: FieldType.Boolean,
						label: { text: 'IsReceipt' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsConsumed',
						model: 'IsConsumed',
						type: FieldType.Boolean,
						label: { text: 'IsConsumed' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProvision',
						model: 'IsProvision',
						type: FieldType.Boolean,
						label: { text: 'IsProvision' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReservation',
						model: 'IsReservation',
						type: FieldType.Boolean,
						label: { text: 'IsReservation' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDispatching',
						model: 'IsDispatching',
						type: FieldType.Boolean,
						label: { text: 'IsDispatching' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDelta',
						model: 'IsDelta',
						type: FieldType.Boolean,
						label: { text: 'IsDelta' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsJournal',
						model: 'IsJournal',
						type: FieldType.Boolean,
						label: { text: 'IsJournal' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
