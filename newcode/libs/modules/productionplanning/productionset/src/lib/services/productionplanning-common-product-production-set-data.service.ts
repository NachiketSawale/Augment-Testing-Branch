/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IPpsProductEntity } from '@libs/productionplanning/product';
import { PpsProductComplete } from '@libs/productionplanning/product';
import { IProductionsetEntity } from '../model/models';
import { ProductionplanningProductionsetDataService } from './productionplanning-productionset-data.service';
import { ProductionplanningProductionsetComplete } from '../model/productionplanning-productionset-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningCommonProductProductionSetDataService extends DataServiceFlatNode<IPpsProductEntity, PpsProductComplete, IProductionsetEntity, ProductionplanningProductionsetComplete> {
	public constructor(private productionSetDataService:ProductionplanningProductionsetDataService) {
		const options: IDataServiceOptions<IPpsProductEntity> = {
			apiUrl: 'productionplanning/common/product',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customlistbyforeignkey',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'productionSetCreate',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsProductEntity,IProductionsetEntity,ProductionplanningProductionsetComplete>>{
				role: ServiceRole.Node,
				itemName: 'Product',
				parent: productionSetDataService
			},
		};
		super(options);
	}

	public override createUpdateEntity(modified: IPpsProductEntity | null): PpsProductComplete {
		const complete = new PpsProductComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Products = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsProductComplete): IPpsProductEntity[] {
		if (complete.Products === null) {
			complete.Products = [];
		}
		return complete.Products;
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				foreignKey: 'ProductionSetFk',
				mainItemId: parentSelection.Id,
			};
		}
		return {
			Value: -1
		};
	}


	protected override onLoadSucceeded(loaded: IPpsProductResponse): IPpsProductEntity[] {
		if (loaded) {
			return loaded.Main;
		}
		return [];
	}

}
interface IPpsProductResponse {
	Main: IPpsProductEntity[]
}
