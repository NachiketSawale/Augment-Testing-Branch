/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { SubsidiaryEntityComplete } from '../model/entities/subsidiary-entity-complete.class';
import { BusinessPartnerMainSubsidiaryDataService } from './subsidiary-data.service';
import { IRegionEntity, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})

export class BusinessPartnerMainRegionDataService extends DataServiceFlatLeaf<IRegionEntity,ISubsidiaryEntity, SubsidiaryEntityComplete>{

	public constructor(parentService: BusinessPartnerMainSubsidiaryDataService) {
		const options: IDataServiceOptions<IRegionEntity>  = {
			apiUrl: 'businesspartner/main/region',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IRegionEntity,ISubsidiaryEntity, SubsidiaryEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Region',
				parent: parentService,
			},
		};

		super(options);
	}
	
}