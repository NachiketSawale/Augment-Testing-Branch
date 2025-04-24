/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ProductionplanningProductionsetDataService } from './productionplanning-productionset-data.service';
import { IPpsProductionSubsetEntity } from '../model/entities/external_entities/pps-production-subset-entity.interface';
import { IProductionsetEntity } from '../model/models';
import { ProductionplanningProductionsetComplete } from '../model/productionplanning-productionset-complete.class';


@Injectable({
	providedIn: 'root'
})

export class PpsProductionSubsetDataService extends DataServiceFlatLeaf<IPpsProductionSubsetEntity,IProductionsetEntity, ProductionplanningProductionsetComplete >{

	public constructor(parentDataService: ProductionplanningProductionsetDataService) {
		const options: IDataServiceOptions<IPpsProductionSubsetEntity>  = {
			apiUrl: 'productionplanning/fabricationunit/productionsubset',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getByProductionSet',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsProductionSubsetEntity,IProductionsetEntity, ProductionplanningProductionsetComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProductionSubset',
				parent: parentDataService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				foreignKey: 'productionSetId',
				productionSetId: parentSelection.Id
			};
		}
		return {
			Value: -1
		};
	}

	protected override onLoadSucceeded(loaded: IPpsProductionsetSubsetResponse): IPpsProductionSubsetEntity[] {
		if (loaded) {
			return loaded.Main;
		}
		return [];
	}


}
interface IPpsProductionsetSubsetResponse {
	Main: IPpsProductionSubsetEntity[]
}


