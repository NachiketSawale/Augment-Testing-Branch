/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import {
	DataServiceFlatLeaf,
	IDataServiceOptions,
	ServiceRole,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IEntityList
} from '@libs/platform/data-access';

import { IPpsRackAssignEntity , IPpsProductEntity } from '../model/models';
import { PpsProductComplete } from '../model/productionplanning-product-complete.class';
import { PpsProductDataService } from './pps-product-data.service';

@Injectable({
	providedIn: 'root'
})

export class PpsProductRackAssignmentDataService extends DataServiceFlatLeaf<IPpsRackAssignEntity,IPpsProductEntity, PpsProductComplete>{

	public constructor(parentDataService: PpsProductDataService) {
		const options: IDataServiceOptions<IPpsRackAssignEntity>  = {
			apiUrl: 'productionplanning/product/rackassignment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyproduct',
				usePost: false,
				prepareParam: ident => {
					return { productId: this.getSelectedParent()?.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsRackAssignEntity,IPpsProductEntity, PpsProductComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RackAssignment',
				parent: parentDataService,
			},
		};

		super(options);
	}

	private transferModification2Complete(complete: PpsProductComplete, modified: IPpsRackAssignEntity[], deleted: IPpsRackAssignEntity[]) {
		if (modified && modified.length > 0) {
			complete.RackAssignmentToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.RackAssignmentToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: PpsProductComplete, entityList: IEntityList<IPpsRackAssignEntity>) {
		if (complete && complete.RackAssignmentToSave && complete.RackAssignmentToSave.length > 0) {
			entityList.updateEntities(complete.RackAssignmentToSave);
		}
	}
}



