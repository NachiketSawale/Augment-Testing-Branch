import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IReportEntity, ITimekeepingEmpVerificationEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportComplete } from '../model/timekeeping-recording-report-complete.class';
import { TimekeepingRecordingReportDataService } from './timekeeping-recording-report-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingRecordingReportVerificationDataService extends DataServiceFlatLeaf<ITimekeepingEmpVerificationEntity,
	IReportEntity, TimekeepingRecordingReportComplete> {

	public constructor(timekeepingRecordingReportDataService : TimekeepingRecordingReportDataService) {
		const options: IDataServiceOptions<ITimekeepingEmpVerificationEntity> = {
			apiUrl: 'timekeeping/recording/verification',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					const selection = timekeepingRecordingReportDataService.getSelection()[0];
					return { pKey1 : selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingEmpVerificationEntity,
				IReportEntity, TimekeepingRecordingReportComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Verification',
				parent: timekeepingRecordingReportDataService
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}
}
