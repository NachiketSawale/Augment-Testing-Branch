/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';




import { DataServiceHierarchicalRoot,IDataServiceEndPointOptions,IDataServiceRoleOptions,ServiceRole,IDataServiceOptions }
from '@libs/platform/data-access';



import { BasicsControllingCostCodesComplete } from '../model/basics-controlling-cost-codes-complete.class';
import { IContrCostCodeEntity } from '../model/entities/contr-cost-code-entity.interface';


@Injectable({
	providedIn: 'root'
})

export class BasicsControllingCostCodesDataService extends DataServiceHierarchicalRoot<IContrCostCodeEntity, BasicsControllingCostCodesComplete> {

	public constructor() {
		const options: IDataServiceOptions<IContrCostCodeEntity> = {
			apiUrl: 'basics/controllingcostcodes',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treefiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IContrCostCodeEntity>>{
				role: ServiceRole.Root,
				itemName: 'ContrCostCodes',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IContrCostCodeEntity | null): BasicsControllingCostCodesComplete {
		const complete = new BasicsControllingCostCodesComplete();
		if (modified !== null) {
			//complete.Id = modified.Id; // TODO: fix me
			complete.ContrCostCodes = [modified];
		}

		return complete;
	}

}

