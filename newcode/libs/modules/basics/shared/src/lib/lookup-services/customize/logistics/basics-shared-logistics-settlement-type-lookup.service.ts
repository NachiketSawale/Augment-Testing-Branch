/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettlementTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettlementTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettlementTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettlementTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/logisticssettlementtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '2230f037ab2148088ca13c711a09bf60',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLogisticsSettlementTypeEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Abbreviation1',
						model: 'Abbreviation1',
						type: FieldType.Code,
						label: { text: 'Abbreviation1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Abbreviation2',
						model: 'Abbreviation2',
						type: FieldType.Code,
						label: { text: 'Abbreviation2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InvoiceTypeFk',
						model: 'InvoiceTypeFk',
						type: FieldType.Quantity,
						label: { text: 'InvoiceTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'VoucherTypeFk',
						model: 'VoucherTypeFk',
						type: FieldType.Quantity,
						label: { text: 'VoucherTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined1',
						model: 'Userdefined1',
						type: FieldType.Description,
						label: { text: 'Userdefined1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined2',
						model: 'Userdefined2',
						type: FieldType.Description,
						label: { text: 'Userdefined2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Userdefined3',
						model: 'Userdefined3',
						type: FieldType.Description,
						label: { text: 'Userdefined3' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInternal',
						model: 'IsInternal',
						type: FieldType.Boolean,
						label: { text: 'IsInternal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsExternal',
						model: 'IsExternal',
						type: FieldType.Boolean,
						label: { text: 'IsExternal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsInterCompany',
						model: 'IsInterCompany',
						type: FieldType.Boolean,
						label: { text: 'IsInterCompany' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TransactionTypeFk',
						model: 'TransactionTypeFk',
						type: FieldType.Quantity,
						label: { text: 'TransactionTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TransactionTypeCredFk',
						model: 'TransactionTypeCredFk',
						type: FieldType.Quantity,
						label: { text: 'TransactionTypeCredFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'VatGroupFk',
						model: 'VatGroupFk',
						type: FieldType.Quantity,
						label: { text: 'VatGroupFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
