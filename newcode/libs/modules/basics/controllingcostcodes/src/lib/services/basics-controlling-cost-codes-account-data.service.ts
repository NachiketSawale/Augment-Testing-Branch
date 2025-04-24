/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';


import { BasicsControllingCostCodesAccountComplete } from '../model/basics-controlling-cost-codes-account-complete.class';
import { IAccount2MdcContrCostEntity } from '../model/entities/account-2mdc-contr-cost-entity.interface';
import { IContrCostCodeEntity } from '../model/entities/contr-cost-code-entity.interface';
import { BasicsControllingCostCodesComplete } from '../model/basics-controlling-cost-codes-complete.class';
import { BasicsControllingCostCodesDataService } from './basics-controlling-cost-codes-data.service';

@Injectable({
	providedIn: 'root'
})


export class BasicsControllingCostCodesAccountDataService extends DataServiceFlatNode<IAccount2MdcContrCostEntity, BasicsControllingCostCodesAccountComplete, IContrCostCodeEntity, BasicsControllingCostCodesComplete> {

	public constructor(parentService: BasicsControllingCostCodesDataService) {
		const options: IDataServiceOptions<IAccount2MdcContrCostEntity> = {
			apiUrl: 'basics/controllingcostcodes/account',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: ident => {
					return {
						MdcContrCostCodeFk: ident.pKey1
					};
				}
			},
			// deleteInfo: <IDataServiceEndPointOptions>{   // TODO: check
			// 	endPoint: '//TODO: Add deleteInfo endpoint here'
			// },
			roleInfo: <IDataServiceChildRoleOptions<IAccount2MdcContrCostEntity, IContrCostCodeEntity, BasicsControllingCostCodesComplete>>{
				role: ServiceRole.Node,
				itemName: 'Account2MdcContrCost',
				parent: parentService,
			},
		};

		super(options);
	}

}





