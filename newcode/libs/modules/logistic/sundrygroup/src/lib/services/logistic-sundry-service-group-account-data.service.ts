/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupAccountEntity, ILogisticSundryServiceGroupComplete } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupDataService } from '../services/logistic-sundry-service-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServiceGroupAccountDataService extends DataServiceFlatLeaf<ILogisticSundryServiceGroupAccountEntity,
	ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ILogisticSundryServiceGroupAccountEntity> = {
			apiUrl: 'logistic/sundrygroup/account',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ILogisticSundryServiceGroupAccountEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Accounts',
				parent: inject(LogisticSundryServiceGroupDataService)
			},
		};

		super(options);
	}
}
