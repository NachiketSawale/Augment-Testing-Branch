/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IJobEntity, ILogisticJobPlantPriceEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IIdentificationData } from '@libs/platform/common';
@Injectable({
	providedIn: 'root'
})

export class LogisticJobPlantPriceDataService extends DataServiceFlatLeaf<ILogisticJobPlantPriceEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<ILogisticJobPlantPriceEntity>  = {
			apiUrl: 'logistic/job/plantprice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						plantFk: ident.pKey1
					};
				}
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticJobPlantPriceEntity,IJobEntity, JobComplete >>{
				role: ServiceRole.Leaf,
				itemName: 'PlantPrices',
				parent: logisticJobDataService,
			},


		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: ILogisticJobPlantPriceEntity[], deleted: ILogisticJobPlantPriceEntity[]) {
		if (modified && modified.length > 0) {
			complete.PlantPricesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.PlantPricesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): ILogisticJobPlantPriceEntity[] {
		if (complete && complete.PlantPricesToSave) {
			return complete.PlantPricesToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: ILogisticJobPlantPriceEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}

}



