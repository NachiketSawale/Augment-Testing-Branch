/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})
export class SalesContractPreviousWipLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdHeaderEntity, TEntity> {
	public constructor() {
		const dataService = inject(SalesContractContractsDataService);
		const selectedItem = dataService.getSelection()[0];
		const createFilter = (contractId?: number, projectId?: number, filterKey: string = 'sales-wip-previouswip-filter-by-server') => {
			return JSON.stringify({
				SearchFields: ['Code', 'DescriptionInfo'],
				SearchText: '',
				FilterKey: filterKey,
				AdditionalParameters: {
					ContractId: contractId || selectedItem?.OrdHeaderFk || null,
					ProjectId: projectId || selectedItem?.ProjectFk || null,
				},
				TreeState: {
					StartId: null,
					Depth: null
				},
				RequirePaging: false
			});
		};

		const filter = createFilter();

		const endpoint = {
			httpRead: {
				route: 'basics/lookupdata/master/getsearchlist',
				endPointRead: `?lookup=saleswipv2&filtervalue=${filter}`,
				usePostForRead: false
			}
		};

		const gridConfig: ILookupConfig<IOrdHeaderEntity, TEntity> = {
			uuid: '9d290e62073c46e9bb92ade7394b8728',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '9d290e62073c46e9bb92ade7394b8728',
				columns: [
					{id: 'Code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'sales.wip.entityWipCode'}, sortable: true, visible: true, readonly: false, width: 200},
					{id: 'description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				],
			},
			dialogOptions: {
				headerText: 'Assign A Wip',
				alerts: []
			},
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}