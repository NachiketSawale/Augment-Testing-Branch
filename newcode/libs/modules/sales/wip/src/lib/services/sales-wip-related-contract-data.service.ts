/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesWipRelatedContractDataService extends DataServiceFlatLeaf<IOrdHeaderEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IOrdHeaderEntity> = {
			apiUrl: 'sales/contract',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'contractsbyWipId',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IOrdHeaderEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'OrdHeader',
				parent: dataService
			}
		};
		super(options);
	}

	public override canCreate(): boolean {
		return false;
	}

	public override canDelete(): boolean {
		return false;
	}
}