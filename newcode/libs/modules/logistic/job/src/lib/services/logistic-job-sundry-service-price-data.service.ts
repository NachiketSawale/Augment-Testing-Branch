/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IJobEntity, ILogisticJobSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { LogisticJobDataService } from './logistic-job-data.service';
import { JobComplete } from '../model/logistic-job-complete.class';
import { IIdentificationData } from '@libs/platform/common';
@Injectable({
	providedIn: 'root'
})


export class LogisticJobSundryServicePriceDataService extends DataServiceFlatLeaf<ILogisticJobSundryServicePriceEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<ILogisticJobSundryServicePriceEntity>  = {
			apiUrl: 'logistic/job/sundryserviceprice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticJobSundryServicePriceEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SundryServicePrices',
				parent: logisticJobDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: ILogisticJobSundryServicePriceEntity[], deleted: ILogisticJobSundryServicePriceEntity[]) {
		if (modified && modified.length > 0) {
			complete.SundryServicePricesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.SundryServicePricesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): ILogisticJobSundryServicePriceEntity[] {
		if (complete && complete.SundryServicePricesToSave) {
			return complete.SundryServicePricesToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: ILogisticJobSundryServicePriceEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}
}



