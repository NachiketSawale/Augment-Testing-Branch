/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IEstPricelistEntity } from "../model/entities/est-pricelist-entity.interface";
import { IPricelistTypeEntity } from "../model/entities/pricelist-type-entity.interface";
import { ResourcePlantpricingPricelistTypeComplete } from "../model/resource-plantpricing-pricelist-type-complete.class";
import { ResourcePlantpricingPricelistTypeDataService } from "./resource-plantpricing-pricelist-type-data.service";


export const RESOURCE_PLANTPRICING_EST_PRICELIST_DATA_TOKEN = new InjectionToken<ResourcePlantpricingEstPricelistDataService>('resourcePlantpricingEstPricelistDataToken');

@Injectable({
	providedIn: 'root'
})

export class ResourcePlantpricingEstPricelistDataService extends DataServiceFlatLeaf<IEstPricelistEntity,IPricelistTypeEntity, ResourcePlantpricingPricelistTypeComplete >{

	public constructor(resourcePlantpricingPricelistTypeDataService : ResourcePlantpricingPricelistTypeDataService) {
		const options: IDataServiceOptions<IEstPricelistEntity>  = {
			apiUrl: 'resource/plantpricing/estpricelist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstPricelistEntity,IPricelistTypeEntity, ResourcePlantpricingPricelistTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EstPricelists',
				parent: resourcePlantpricingPricelistTypeDataService,
			},
		};

		super(options);
	}

}



