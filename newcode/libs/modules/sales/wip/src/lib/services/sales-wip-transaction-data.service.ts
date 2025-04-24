/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import {IIdentificationData} from '@libs/platform/common';
import { IWipTransactionEntity } from '../model/entities/wip-transaction-entity.interface';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root'
})

export class SalesWipTransactionDataService extends DataServiceFlatLeaf<IWipTransactionEntity, IWipHeaderEntity,WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IWipTransactionEntity> = {
			apiUrl: 'sales/wip/transaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
			},
			createInfo:{
				prepareParam: ident => {
					const selection = dataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IWipTransactionEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WipCertificate',
				parent: dataService
			}
		};

		super(options);
	}
}