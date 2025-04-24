/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { TimekeepingRecordingComplete } from '../model/timekeeping-recording-complete.class';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';



export const TIMEKEEPING_RECORDING_DATA_TOKEN = new InjectionToken<TimekeepingRecordingDataService>('timekeepingRecordingDataToken');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingRecordingDataService extends DataServiceFlatRoot<IRecordingEntity, TimekeepingRecordingComplete> {

	public constructor() {
		const options: IDataServiceOptions<IRecordingEntity> = {
			apiUrl: 'timekeeping/recording',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IRecordingEntity>>{
				role: ServiceRole.Root,
				itemName: 'Recordings',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IRecordingEntity | null): TimekeepingRecordingComplete {
		const complete = new TimekeepingRecordingComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Recordings = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: TimekeepingRecordingComplete): IRecordingEntity[] {
		if (complete.Recordings === null) {
			return [];
		}

		return complete.Recordings;
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}







