/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IJobEntity, ILogisticJobCostCodeRateEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticJobCostcodeRateDataService extends DataServiceFlatLeaf<ILogisticJobCostCodeRateEntity,IJobEntity, JobComplete>{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<ILogisticJobCostCodeRateEntity>  = {
			apiUrl: 'logistic/job/costcoderate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1 : ident.pKey1 };
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticJobCostCodeRateEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CostCodeRates',
				parent: logisticJobDataService,
			},


		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: ILogisticJobCostCodeRateEntity[], deleted: ILogisticJobCostCodeRateEntity[]) {
		if (modified && modified.length > 0) {
			complete.CostCodeRatesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.CostCodeRatesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): ILogisticJobCostCodeRateEntity[] {
		if (complete && complete.CostCodeRatesToSave) {
			return complete.CostCodeRatesToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: ILogisticJobCostCodeRateEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}
}



