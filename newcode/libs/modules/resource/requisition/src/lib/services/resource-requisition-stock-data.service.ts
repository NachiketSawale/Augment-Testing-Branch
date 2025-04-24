/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IRequisitionitemEntity, IStockTotalVEntity } from '@libs/resource/interfaces';
import { RequisitionItemComplete } from '../model/requisition-item-complete.class';
import { ResourceRequisitionItemDataService } from './resource-requisition-item-data.service';



@Injectable({
	providedIn: 'root'
})



export class ResourceRequisitionStockDataService extends DataServiceFlatLeaf<IStockTotalVEntity,IRequisitionitemEntity, RequisitionItemComplete >{

	public constructor(resourceRequisitionItemDataService:ResourceRequisitionItemDataService) {
		const options: IDataServiceOptions<IStockTotalVEntity>  = {
			apiUrl: 'resource/requisition/stocktotal_v',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: () => {
					const selection = this.getSelectedParent();
					return { PKey1: selection?.StockFk?? '',
						PKey2: selection?.MaterialFk?? '',
						filter:''};
				}

			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IStockTotalVEntity,IRequisitionitemEntity, RequisitionItemComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'StockTotalVDto',
				parent: resourceRequisitionItemDataService,
			},


		};

		super(options);
	}

	public override isParentFn(parentKey: IRequisitionitemEntity, entity: IStockTotalVEntity): boolean {
		return entity.StockFk === parentKey.Id;
	}

}








