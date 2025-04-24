import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { IOrdBoqEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class OrdBoqLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdBoqEntity, TEntity> {

	public constructor() {
	const headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
		const endpoint = {
			httpRead: {
				route: 'sales/contract/boq/',
				endPointRead: 'list?contractId=' + (headerDataService.getSelectedEntity()?.Id ?? 0).toString(),
			}
		};

		const gridConfig: ILookupConfig<IOrdBoqEntity, TEntity> = {
			uuid: '3a77eb08ed0743b4a7cdf198cf279377',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'BoqRootItem.Factor',

			gridConfig: {
				uuid: '3a77eb08ed0743b4a7cdf198cf279377',
				columns: [
					{id: 'Reference', model: 'BoqRootItem.Factor', type: FieldType.Description, label: {text: 'Brief'}, sortable: true, visible: true, readonly: true},
					{id: 'Brief', model: 'BoqRootItem.BriefInfo.Description', type: FieldType.Description, label: {text: 'Brief'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Contract BoQ',
				alerts: []
			},
			showDialog: false,
		};

		super(endpoint, gridConfig);
	}
}