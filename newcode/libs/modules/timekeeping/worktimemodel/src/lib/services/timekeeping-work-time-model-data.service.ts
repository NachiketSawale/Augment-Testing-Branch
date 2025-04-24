/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';






import { TimekeepingWorkTimeModelComplete } from '../model/timekeeping-work-time-model-complete.class';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';




@Injectable({
	providedIn: 'root'
})

export class TimekeepingWorkTimeModelDataService extends DataServiceFlatRoot<IWorkTimeModelEntity, TimekeepingWorkTimeModelComplete> {

	public constructor() {
		const options: IDataServiceOptions<IWorkTimeModelEntity> = {
			apiUrl: 'timekeeping/worktimemodel',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IWorkTimeModelEntity>>{
				role: ServiceRole.Root,
				itemName: 'WorkTimeModel',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IWorkTimeModelEntity | null): TimekeepingWorkTimeModelComplete {
		const complete = new TimekeepingWorkTimeModelComplete();
		if (modified !== null) {
			complete.workTimeId = modified.Id;
			complete.WorkTimeModels = [modified];
			complete.WorkTimeModels.forEach(e => {
				if (e.DescriptionInfo?.Translated){
					e.DescriptionInfo.Modified = true;
				}
			});
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: TimekeepingWorkTimeModelComplete) {
		if (complete.WorkTimeModels === null) {
			complete.WorkTimeModels = [];
		}

		return complete.WorkTimeModels;
	}

}







