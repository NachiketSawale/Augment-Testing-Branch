/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICertificatedPlantEntity } from '@libs/resource/interfaces';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ResourceCertificateDataService } from './resource-certificate-data.service';
import { ResourceCertificateComplete } from '../model/resource-certificate-complete.class';
import { IIdentificationData } from '@libs/platform/common';


export const RESOURCE_CERTIFICATED_PLANT_DATA_TOKEN = new InjectionToken<ResourceCertificatedPlantDataService>('resourceCertificatedPlantDataToken');

@Injectable({
	providedIn: 'root'
})


export class ResourceCertificatedPlantDataService extends DataServiceFlatLeaf<ICertificatedPlantEntity,ICertificateEntity, ResourceCertificateComplete >{

	public constructor() {
		const options: IDataServiceOptions<ICertificatedPlantEntity>  = {
			apiUrl: 'resource/certificate/certificatedplant',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICertificatedPlantEntity,ICertificateEntity, ResourceCertificateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CertificatedPlants',
				parent: inject(ResourceCertificateDataService),
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ResourceCertificateComplete, modified: ICertificatedPlantEntity[], deleted: ICertificatedPlantEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.CertificatedPlantsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.CertificatedPlantsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceCertificateComplete): ICertificatedPlantEntity[] {
		if (complete && complete.CertificatedPlantsToSave) {
			return complete.CertificatedPlantsToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: ICertificateEntity, entity: ICertificatedPlantEntity): boolean {
		return entity.CertificateFk === parentKey.Id;
	}

}








