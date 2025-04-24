/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityList } from '@libs/platform/data-access';
import { IJobEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';

@Injectable({
	providedIn: 'root',
})
export class LogisticJobDataService extends DataServiceFlatRoot<IJobEntity, JobComplete> {
	public constructor() {
		const options: IDataServiceOptions<IJobEntity> = {
			apiUrl: 'logistic/job',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IJobEntity>>{
				role: ServiceRole.Root,
				itemName: 'Jobs',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: IJobEntity | null): JobComplete {
		const complete = new JobComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Jobs = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: JobComplete): IJobEntity[] {
		if (complete.Jobs === null) {
			complete.Jobs = [];
		}

		return complete.Jobs;
	}


	protected override checkCreateIsAllowed(entities: IJobEntity[] | IJobEntity | null): boolean {
		return entities !== null;
	}

	protected takeOverUpdatedFromComplete(complete: JobComplete, entityList: IEntityList<IJobEntity>) {
		if (complete && complete.Jobs && complete.Jobs.length > 0) {
			entityList.updateEntities(complete.Jobs);
		}
	}

}

