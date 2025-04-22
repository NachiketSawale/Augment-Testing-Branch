/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ISalesSharedWipBillingEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SalesSharedWipLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ISalesSharedWipBillingEntity, TEntity> {
	public constructor() {
		super('SalesWip', {
			uuid: '336a73b7378d4a31af088b1de82616d5',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'sales.wip.entityCode' },
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
					text: 'Assign A Wip',
					key: 'sales.common.dialogTitleAssignWip',
				},
			},
			showDialog: true,
		});
	}
}
