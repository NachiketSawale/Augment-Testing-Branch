/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceOptions,
	ServiceRole,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';

import { IPpsCuttingProductVEntity, IPpsProductEntity } from '../model/models';
import { PpsProductComplete } from '../model/productionplanning-product-complete.class';
import { PpsProductDataService } from './pps-product-data.service';


@Injectable({
	providedIn: 'root'
})


export class PpsCuttingProductDataService extends DataServiceFlatRoot<IPpsCuttingProductVEntity, PpsProductComplete> {

	public constructor(parentService: PpsProductDataService) {
		const options: IDataServiceOptions<IPpsCuttingProductVEntity> = {
			apiUrl: 'productionplanning/product/cuttingproduct',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsCuttingProductVEntity, IPpsProductEntity, PpsProductComplete>>{
				role: ServiceRole.Root,
				itemName: 'CuttingProduct'
			},
		};

		super(options);
	}

}



