/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IEngTaskEntity } from '../model/entities/eng-task-entity.interface';
import { EngTaskComplete } from '../model/entities/eng-task-complete.class';

@Injectable({
	providedIn: 'root',
})
export class EngineeringTaskDataService extends DataServiceFlatRoot<IEngTaskEntity, EngTaskComplete> {
	public constructor() {
		const options: IDataServiceOptions<IEngTaskEntity> = {
			apiUrl: 'productionplanning/engineering/task',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IEngTaskEntity>>{
				role: ServiceRole.Root,
				itemName: 'EngTasks',
			},
		};

		super(options);
	}

	public override getModificationsFromUpdate(complete: EngTaskComplete): IEngTaskEntity[] {
		if (complete.EngTasks) {
			return complete.EngTasks;
		}
		return [];
	}

	public override createUpdateEntity(modified: IEngTaskEntity | null): EngTaskComplete {
		const complete = new EngTaskComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.EngTasks = [modified];
		}

		return complete;
	}
}
