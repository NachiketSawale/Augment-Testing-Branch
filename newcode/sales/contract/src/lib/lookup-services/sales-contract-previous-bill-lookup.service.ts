/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractPreviousBillLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBillHeaderEntity, TEntity> {
	public constructor() {
	const dataService = inject(SalesContractContractsDataService);
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/getsearchlist',
						endPointRead: '?lookup=salesbillingv2&filtervalue=%7B%22SearchFields%22%3A%5B%22BillNo%22%2C%22DescriptionInfo%22%5D%2C%22SearchText%22%3A%22%22%2C%22FilterKey%22%3A%22sales-billing-previous-bill-from-contract%22%2C%22AdditionalParameters%22%3A%7B%22ContractId%22%3A'+ dataService.getSelection()[0].Id +'%7D%2C%22TreeState%22%3A%7B%22StartId%22%3Anull%2C%22Depth%22%3Anull%7D%2C%22RequirePaging%22%3Afalse%7D',
						usePostForRead: false
					}
			};

		const gridConfig: ILookupConfig<IBillHeaderEntity, TEntity> = {
			uuid: '7ecae6183c404ec99eeea138e5754e65',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'BillNo',
			gridConfig: {
				uuid: '7ecae6183c404ec99eeea138e5754e65',
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