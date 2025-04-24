/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { ILogisticSundryServiceGroupEntity, ILogisticSundryGroupTaxCodeEntity, ILogisticSundryServiceGroupComplete } from '@libs/logistic/interfaces';
import { LogisticSundryServiceGroupDataService } from '../services/logistic-sundry-service-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class LogisticSundryServiceGroupTaxCodeDataService extends DataServiceFlatLeaf<ILogisticSundryGroupTaxCodeEntity,
	ILogisticSundryServiceGroupEntity, ILogisticSundryServiceGroupComplete> {
	public constructor() {
		const options: IDataServiceOptions<ILogisticSundryGroupTaxCodeEntity> = {
			apiUrl: 'logistic/sundrygroup/taxcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ILogisticSundryGroupTaxCodeEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'TaxCode',
				parent: inject(LogisticSundryServiceGroupDataService)
			},
		};

		super(options);
	}
}
