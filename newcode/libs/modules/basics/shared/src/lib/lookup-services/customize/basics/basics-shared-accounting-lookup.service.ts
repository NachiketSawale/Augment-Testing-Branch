/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountingEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountingEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountingLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountingEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accounting/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '42404a1d3e9d43a3a097991bdfdea222',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
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
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'LedgerContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description2Info',
						model: 'Description2Info',
						type: FieldType.Translation,
						label: { text: 'Description2Info' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsBalanceSheet',
						model: 'IsBalanceSheet',
						type: FieldType.Boolean,
						label: { text: 'IsBalanceSheet' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProfitAndLoss',
						model: 'IsProfitAndLoss',
						type: FieldType.Boolean,
						label: { text: 'IsProfitAndLoss' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCostCode',
						model: 'IsCostCode',
						type: FieldType.Boolean,
						label: { text: 'IsCostCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsRevenueCode',
						model: 'IsRevenueCode',
						type: FieldType.Boolean,
						label: { text: 'IsRevenueCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsSurcharge',
						model: 'IsSurcharge',
						type: FieldType.Boolean,
						label: { text: 'IsSurcharge' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
