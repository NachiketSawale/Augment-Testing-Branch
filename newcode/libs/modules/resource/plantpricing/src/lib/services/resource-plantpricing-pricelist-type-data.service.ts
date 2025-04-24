/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';



import {  IDataServiceOptions, ServiceRole,  IDataServiceEndPointOptions, DataServiceFlatRoot, IDataServiceRoleOptions } from '@libs/platform/data-access';





import { IPricelistEntity } from '../model/entities/pricelist-entity.interface';
import { ResourcePlantpricingPricelistTypeComplete } from '../model/resource-plantpricing-pricelist-type-complete.class';


export const RESOURCE_PLANTPRICING_PRICELIST_TYPE_DATA_TOKEN = new InjectionToken<ResourcePlantpricingPricelistTypeDataService>('resourcePlantpricingPricelistTypeDataToken');

@Injectable({
	providedIn: 'root'
})





export class ResourcePlantpricingPricelistTypeDataService extends DataServiceFlatRoot<IPricelistEntity,ResourcePlantpricingPricelistTypeComplete >{

	public constructor() {
		const options: IDataServiceOptions<IPricelistEntity>  = {
			apiUrl: 'resource/plantpricing/pricelisttype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPricelistEntity>>{
				role: ServiceRole.Root,
				itemName: 'PricelistTypes'
			},

		};

		super(options);
	}

}



