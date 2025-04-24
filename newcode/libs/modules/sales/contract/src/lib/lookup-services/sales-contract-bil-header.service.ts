/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { IBillHeaderEntityGenerated } from '../model/entities/bill-header-entity-generated.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesContractBilHeaderLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBillHeaderEntity, TEntity> {

	public constructor() {

		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/',
						endPointRead: 'getlist?lookup=salesbillingv2',
						usePostForRead: false,
					}
			};

		const gridConfig: ILookupConfig<IBillHeaderEntityGenerated, TEntity> = {
			uuid: 'eb1d7c4401514509871c8c0be90f6022',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'BillNo',
			gridConfig: {
				uuid: 'eb1d7c4401514509871c8c0be90f6022',
				columns: [
					{id: 'BillNo', model: 'BillNo', type: FieldType.Code, label: {text: 'BillNo', key: 'sales.contract.entityBillNo'}, sortable: true, visible: true, readonly: true, width: 200},
					{id: 'Description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				],
			},
			dialogOptions: {
				headerText: 'Bill Header',
				alerts: []
			},
			// showGrid: true,
			showDialog: false,
		};

		super(endpoint, gridConfig);
	}
}