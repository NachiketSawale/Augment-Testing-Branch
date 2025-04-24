/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ITimeAllocationHeaderEntity } from '../model/entities/time-allocation-header-entity.interface';
import { TimeAllocationHeaderComplete } from '../model/entities/time-allocation-header-complete.class';


@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeallocationHeaderDataService extends DataServiceFlatRoot<ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<ITimeAllocationHeaderEntity> = {
			apiUrl: 'timekeeping/timeallocation/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<ITimeAllocationHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'TimeAllocationHeaderDtos',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: ITimeAllocationHeaderEntity | null): TimeAllocationHeaderComplete {
		const complete = new TimeAllocationHeaderComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.TimeAllocationHeaderDtos = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: TimeAllocationHeaderComplete): ITimeAllocationHeaderEntity[] {
		if (complete.TimeAllocationHeaderDtos === null) {
			return [];
		}
		if(complete.TimeAllocationHeaderDtos){
			return complete.TimeAllocationHeaderDtos;
		}
		return [];
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}







