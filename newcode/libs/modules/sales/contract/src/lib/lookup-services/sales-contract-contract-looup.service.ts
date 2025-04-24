import { inject, Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class salesContractContractLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdHeaderEntity, TEntity> {
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	public constructor() {
		super({
			httpRead: {
				route: 'sales/contract/',
				endPointRead: 'list'
			},
			filterParam: 'projectId',
			prepareListFilter: context => {
				return 'projectId='+ (this.headerDataService.getSelectedEntity()?.ProjectFk ?? 0).toString();
			}
		}, {
			uuid: '5c13bcf70c5344e1aee6f4df5b21f651',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
				],
			},
		});
	}

	// TODO: Check if this can removed ,IsLive should be set from backend as per defined conditions
	public override isItemLive(item: IOrdHeaderEntity): boolean {
		return true;
	}
}