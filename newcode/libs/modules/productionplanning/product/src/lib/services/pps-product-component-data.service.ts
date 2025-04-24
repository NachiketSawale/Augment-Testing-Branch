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

import { IEngProdComponentEntity, IPpsProductEntity } from '../model/models';
import { PpsProductComplete } from '../model/productionplanning-product-complete.class';
import { PpsProductDataService } from './pps-product-data.service';


@Injectable({
	providedIn: 'root'
})


export class PpsProductComponentDataService extends DataServiceFlatLeaf<IEngProdComponentEntity, IPpsProductEntity, PpsProductComplete> {

	public constructor(parentService: PpsProductDataService) {
		const options: IDataServiceOptions<IEngProdComponentEntity> = {
			apiUrl: 'productionplanning/product/engprodcomponent',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyproduct',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : this.getSelectedParent()?.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngProdComponentEntity, IPpsProductEntity, PpsProductComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EngProdComponent',
				parent: parentService,
			},
		};

		super(options);
	}

	private transferModification2Complete(complete: PpsProductComplete, modified: IEngProdComponentEntity[], deleted: IEngProdComponentEntity[]) {
		if (modified && modified.length > 0) {
			complete.EngProdComponentToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.EngProdComponentToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: PpsProductComplete, entityList: IEntityList<IEngProdComponentEntity>) {
		if (complete && complete.EngProdComponentToSave && complete.EngProdComponentToSave.length > 0) {
			entityList.updateEntities(complete.EngProdComponentToSave);
		}
	}
}



