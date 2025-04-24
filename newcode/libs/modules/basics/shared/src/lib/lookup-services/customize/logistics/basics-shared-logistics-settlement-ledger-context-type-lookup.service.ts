/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettlementLedgerContextTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticssettlementledgercontexttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '4280c331355f4268ba9f3efad96015be',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity) => x.DescriptionInfo),
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
						id: 'SettlementTypeFk',
						model: 'SettlementTypeFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
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
						id: 'BillingSchemaFk',
						model: 'BillingSchemaFk',
						type: FieldType.Quantity,
						label: { text: 'BillingSchemaFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TaxCodeFk',
						model: 'TaxCodeFk',
						type: FieldType.Quantity,
						label: { text: 'TaxCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
