/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';

@Injectable({
	providedIn: 'root'
})
/**
 * Sales billing bills data service
 */
export class SalesBillingBillsDataService extends DataServiceFlatRoot<IBilHeaderEntity, BilHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<IBilHeaderEntity> = {
			apiUrl: 'sales/billing',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IBilHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'BilHeader',
			}
		};

		super(options);
	}
	
	public override createUpdateEntity(modified: IBilHeaderEntity | null): BilHeaderComplete {
		const complete = new BilHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Datas = [modified];
		}
		return complete;
	}


	public override getModificationsFromUpdate(complete: BilHeaderComplete): IBilHeaderEntity[] {
		if (complete.Datas) {
			return complete.Datas;
		}
		return [];
	}

}