/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ISalesSharedWipBillingEntity } from '@libs/sales/interfaces';



@Injectable({
	providedIn: 'root',
})
export class SalesSharedBillingLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ISalesSharedWipBillingEntity, TEntity> {
	public constructor() {
		super('SalesBilling', {
			uuid: '258A0F3BAB5A427ABEE4E5949C228C61',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'BillNo',
						model: 'BillNo',
						type: FieldType.Code,
						label: { text: 'Code', key: 'sales.billing.entityBillNo' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'description',
						model: 'DescriptionInfo',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Assign A Bill',
					key: 'sales.common.dialogTitleAssignBill',
				},
			},
			showDialog: true,
		});
	}
}
