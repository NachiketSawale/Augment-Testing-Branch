/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRevenueRecognitionConfigurationEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRevenueRecognitionConfigurationEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRevenueRecognitionConfigurationLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRevenueRecognitionConfigurationEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/revenuerecognitionconfiguration/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '48974f9a01d34d0886a4e6ba0a2aad7c',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Quantity,
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
						id: 'AccrualType',
						model: 'AccrualType',
						type: FieldType.Quantity,
						label: { text: 'AccrualType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Account',
						model: 'Account',
						type: FieldType.Quantity,
						label: { text: 'Account' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StructrueAccountFk',
						model: 'StructrueAccountFk',
						type: FieldType.Quantity,
						label: { text: 'StructrueAccountFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OffsetAccount',
						model: 'OffsetAccount',
						type: FieldType.Quantity,
						label: { text: 'OffsetAccount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StructrueOffsetAccountFk',
						model: 'StructrueOffsetAccountFk',
						type: FieldType.Quantity,
						label: { text: 'StructrueOffsetAccountFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension1',
						model: 'NominalDimension1',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension2',
						model: 'NominalDimension2',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension3',
						model: 'NominalDimension3',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAccrual',
						model: 'IsAccrual',
						type: FieldType.Boolean,
						label: { text: 'IsAccrual' },
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
					}
				]
			}
		});
	}
}
