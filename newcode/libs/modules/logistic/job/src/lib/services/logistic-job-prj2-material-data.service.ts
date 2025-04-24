/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IJobEntity, IProject2MaterialEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticJobPrj2MaterialDataService extends DataServiceFlatLeaf<IProject2MaterialEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<IProject2MaterialEntity>  = {
			apiUrl: 'logistic/job/project2material',
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
			roleInfo: <IDataServiceChildRoleOptions<IProject2MaterialEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Prj2Materials',
				parent: logisticJobDataService,
			},
		};
		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: IProject2MaterialEntity[], deleted: IProject2MaterialEntity[]) {
		if (modified && modified.length > 0) {
			complete.Prj2MaterialsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.Prj2MaterialsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): IProject2MaterialEntity[] {
		if (complete && complete.Prj2MaterialsToSave) {
			return complete.Prj2MaterialsToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: IProject2MaterialEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}
}



