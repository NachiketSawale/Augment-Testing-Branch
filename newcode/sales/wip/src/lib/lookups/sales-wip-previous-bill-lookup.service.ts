/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipPreviousBillLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBillHeaderEntity, TEntity> {
	public constructor() {
		const dataService = inject(SalesWipWipsDataService);
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/getsearchlist',
						endPointRead: '?lookup=salesbillingv2&Id='+ dataService.getSelection()[0].OrdHeaderFk,
						usePostForRead: false
					}
			};

		const gridConfig: ILookupConfig<IBillHeaderEntity, TEntity> = {
			uuid: 'd2870add907443638fefd6f9dcb52134',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'BillNo',
			gridConfig: {
				uuid: 'd2870add907443638fefd6f9dcb52134',
				columns: [
					{id: 'billno', model: 'BillNo', type: FieldType.Description, label: {text: 'Bill No.', key: 'sales.billing.entityBillNo'}, sortable: true, visible: true, readonly: true, width: 200},
					{id: 'description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				],
			},
			dialogOptions: {
				headerText: 'Bill Type',
				alerts: []
			},
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}