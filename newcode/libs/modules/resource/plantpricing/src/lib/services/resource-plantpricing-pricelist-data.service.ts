/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';





import { IPricelistEntity } from '../model/entities/pricelist-entity.interface';
import { ResourcePlantpricingPricelistTypeComplete } from '../model/resource-plantpricing-pricelist-type-complete.class';
import { IPricelistTypeEntity } from '../model/entities/pricelist-type-entity.interface';
import { ResourcePlantpricingPricelistTypeDataService } from './resource-plantpricing-pricelist-type-data.service';


export const RESOURCE_PLANTPRICING_PRICELIST_DATA_TOKEN = new InjectionToken<ResourcePlantpricingPricelistDataService>('resourcePlantpricingPricelistDataToken');

@Injectable({
	providedIn: 'root'
})





export class ResourcePlantpricingPricelistDataService extends DataServiceFlatLeaf<IPricelistEntity,IPricelistTypeEntity, ResourcePlantpricingPricelistTypeComplete >{

	public constructor(resourcePlantpricingPricelistTypeDataService:ResourcePlantpricingPricelistTypeDataService) {
		const options: IDataServiceOptions<IPricelistEntity>  = {
			apiUrl: 'resource/plantpricing/pricelist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPricelistEntity,IPricelistTypeEntity, ResourcePlantpricingPricelistTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Pricelists',
				parent: resourcePlantpricingPricelistTypeDataService,
			},
		};

		super(options);
	}

}



