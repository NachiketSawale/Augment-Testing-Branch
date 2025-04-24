/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 * Sales common billing Lookup Service
 */
export class SalesCommonBillLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IBilHeaderEntity, TEntity> {
	public constructor() {
		super('SalesBilling', {
			uuid: '258a0f3bab5a427abee4e5949c228c61',
			valueMember: 'Id',
			displayMember: 'BillNo',
			gridConfig: {
				columns: [
					{id: 'BillNo', model: 'BillNo', type: FieldType.Description, label: {text: 'Bill No', key: 'sales.billing.entityBillNo'}, sortable: true, visible: true, readonly: true},
					{id: 'Description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true}
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Bill'
				}
			},
			showDialog: true,
			showGrid: false,
		});
	}
}