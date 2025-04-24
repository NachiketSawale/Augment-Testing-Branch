/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IJobEntity, IJobTaskEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IIdentificationData } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})

export class LogisticJobTaskDataService extends DataServiceFlatLeaf<IJobTaskEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<IJobTaskEntity>  = {
			apiUrl: 'logistic/job/jobtask',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyParent',
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
			roleInfo: <IDataServiceChildRoleOptions<IJobTaskEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'JobTasks',
				parent: logisticJobDataService,
			},


		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: IJobTaskEntity[], deleted: IJobTaskEntity[]) {
		if (modified && modified.length > 0) {
			complete.JobTasksToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.JobTasksToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): IJobTaskEntity[] {
		if (complete && complete.JobTasksToSave) {
			return complete.JobTasksToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: IJobTaskEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}
}



