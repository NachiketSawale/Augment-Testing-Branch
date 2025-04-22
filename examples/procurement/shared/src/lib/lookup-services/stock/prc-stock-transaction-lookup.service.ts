/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPrcStockTransactionEntity } from '../../model/entities';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class PrcStockTransactionLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPrcStockTransactionEntity, TEntity> {
	public constructor() {
		super('PrcStocktransaction', {
			uuid: 'd5aaf97f50e24a83831b8c3d07d15fb9',
			valueMember: 'Id',
			displayMember: 'MaterialDescription',
			showClearButton: true,
			dialogOptions: {
				headerText: {
					key: 'procurement.pes.stockTransactionTitle'
				}
			},
			gridConfig: {
				columns: [
					{
						id: 'Id',
						model: 'Id',
						type: FieldType.Code,
						width: 100,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						width: 100,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description1',
						model: 'Description1',
						type: FieldType.Description,
						width: 100,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TransactionDate',
						model: 'TransactionDate',
						type: FieldType.DateUtc,
						width: 150,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Quantity',
						model: 'Quantity',
						type: FieldType.Quantity,
						width: 150,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Total',
						model: 'Total',
						type: FieldType.Money,
						width: 150,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ProvisionPercent',
						model: 'ProvisionPercent',
						type: FieldType.Money,
						width: 150,
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ProvisionTotal',
						model: 'ProvisionTotal',
						type: FieldType.Money,
						width: 150,
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
