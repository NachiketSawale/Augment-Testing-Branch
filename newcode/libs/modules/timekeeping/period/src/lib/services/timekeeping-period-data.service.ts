/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { TimekeepingPeriodComplete } from '../model/timekeeping-period-complete.class';
import { IPeriodEntity } from '../model/entities/period-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPeriodDataService extends DataServiceFlatRoot<IPeriodEntity, TimekeepingPeriodComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPeriodEntity> = {
			apiUrl:  'timekeeping/period',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPeriodEntity>>{
				role: ServiceRole.Root,
				itemName: 'Periods',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IPeriodEntity | null): TimekeepingPeriodComplete {
		const complete = new TimekeepingPeriodComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Periods = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: TimekeepingPeriodComplete): IPeriodEntity[] {
		if (complete.Periods === null) {
			complete.Periods = [];
		}

		return complete.Periods?? [];
	}
	public getProcessors() {
		return this.processor.getProcessors();
	}
}







