/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BillingSchemaComplete } from '@libs/basics/interfaces';
import { IBillingSchemaEntity } from '@libs/basics/shared';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
@Injectable({
	providedIn: 'root'
})

/**
 * Basic billing schema data Service
 */
export class BasicsBillingSchemaDataService extends DataServiceFlatRoot<IBillingSchemaEntity, BillingSchemaComplete> {

	public constructor() {
		const options: IDataServiceOptions<IBillingSchemaEntity> = {
			apiUrl: 'basics/billingschema',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IBillingSchemaEntity>>{
				role: ServiceRole.Root,
				itemName: 'BillingSchema',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IBillingSchemaEntity | null): BillingSchemaComplete {
		const complete = new BillingSchemaComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			//complete.Datas = [modified];
		}

		return complete;
	}

}





		
			





