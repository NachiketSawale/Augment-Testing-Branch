/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractContractsDataService extends DataServiceFlatRoot<IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor() {
		const options: IDataServiceOptions<IOrdHeaderEntity> = {
			apiUrl: 'sales/contract',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IOrdHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'OrdHeader',
			}
		};

		super(options);
	}

	protected override onCreateSucceeded(created: object): IOrdHeaderEntity {
		const newData = created as unknown as IOrdHeaderEntity;
		return newData;
	}

	public override createUpdateEntity(modified: IOrdHeaderEntity | null): SalesContractContractsComplete {
		const complete = new SalesContractContractsComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.OrdHeaders = [modified];
		}

		return complete;
	}
	
}












