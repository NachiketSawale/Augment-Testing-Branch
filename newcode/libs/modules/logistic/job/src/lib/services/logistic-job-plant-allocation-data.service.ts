/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { LogisticJobPlantAllocationComplete } from '../model/logistic-job-plant-allocation-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IJobEntity, IJobPlantAllocationEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';

@Injectable({
	providedIn: 'root'
})

export class LogisticJobPlantAllocationDataService extends DataServiceFlatNode<IJobPlantAllocationEntity, LogisticJobPlantAllocationComplete,IJobEntity, JobComplete >{

	public constructor( logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<IJobPlantAllocationEntity>  = {
			apiUrl: 'logistic/job/plantallocation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						filter: '',
						PKey1: ident.pKey1
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IJobPlantAllocationEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Node,
				itemName: 'PlantAllocations',
				parent: logisticJobDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IJobPlantAllocationEntity | null): LogisticJobPlantAllocationComplete {
		const complete = new LogisticJobPlantAllocationComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
		}

		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: JobComplete, modified: LogisticJobPlantAllocationComplete[], deleted: IJobPlantAllocationEntity[]) {
		if (modified && modified.length > 0) {
			complete.PlantAllocationsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.PlantAllocationsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): IJobPlantAllocationEntity[] {
		if (complete && complete.PlantAllocationsToSave) {
			return complete.PlantAllocationsToSave.flatMap(e => e.PlantAllocations);
		}
		return [];
	}


	public override getModificationsFromUpdate(complete: LogisticJobPlantAllocationComplete): IJobPlantAllocationEntity[] {
		if (complete.PlantAllocations == null) {
			complete.PlantAllocations = [];
		}
		return complete.PlantAllocations;
	}

	public override isParentFn(parentKey: IJobEntity, entity: IJobPlantAllocationEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}
}





