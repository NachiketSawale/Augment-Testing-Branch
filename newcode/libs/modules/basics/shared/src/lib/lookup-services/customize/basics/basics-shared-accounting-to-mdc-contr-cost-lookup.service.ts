/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountingToMdcContrCostEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountingToMdcContrCostEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountingToMdcContrCostLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountingToMdcContrCostEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountingtomdccontrcost/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0514d43add344cdb9ad3faf4fceb66fa',
			valueMember: 'Id',
			displayMember: 'ContextFk',
			gridConfig: {
				columns: [
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
						id: 'AccountFk',
						model: 'AccountFk',
						type: FieldType.Quantity,
						label: { text: 'AccountFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ContrCostCodeFk',
						model: 'ContrCostCodeFk',
						type: FieldType.Quantity,
						label: { text: 'ContrCostCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Factor',
						model: 'Factor',
						type: FieldType.Quantity,
						label: { text: 'Factor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension01',
						model: 'NominalDimension01',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension02',
						model: 'NominalDimension02',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension03',
						model: 'NominalDimension03',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension03' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
