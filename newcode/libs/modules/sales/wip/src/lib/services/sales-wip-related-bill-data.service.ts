/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root'
})

export class SalesWipRelatedBillDataService extends DataServiceFlatLeaf<IBillHeaderEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IBillHeaderEntity> = {
			apiUrl: 'sales/billing',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'billsByWipId',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBillHeaderEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilHeader',
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