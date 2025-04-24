import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';
import { ITimekeepingValidationEntity } from '@libs/timekeeping/period';
import { TimekeepingRecordingComplete } from '../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from './timekeeping-recording-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingRecordingValidationDataService extends DataServiceFlatLeaf<ITimekeepingValidationEntity,
	IRecordingEntity, TimekeepingRecordingComplete> {

	public constructor(timekeepingRecordingDataService : TimekeepingRecordingDataService) {
		const options: IDataServiceOptions<ITimekeepingValidationEntity> = {
			apiUrl: 'timekeeping/period/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyrecording',
				usePost: false,
				prepareParam: ident => {
					const selection = timekeepingRecordingDataService.getSelection()[0];
					return { recordingId : selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingValidationEntity,
				IRecordingEntity, TimekeepingRecordingComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Validations',
				parent: timekeepingRecordingDataService
			},
			entityActions: { deleteSupported: false,createSupported: false}
		};

		super(options);
	}
}
