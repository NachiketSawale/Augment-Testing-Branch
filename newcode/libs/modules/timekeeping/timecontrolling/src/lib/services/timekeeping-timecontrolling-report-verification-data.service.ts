import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import {IReportEntity,ITimekeepingEmpVerificationEntity} from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingReportDataService } from './timekeeping-time-controlling-report-data.service';
import { ControllingReportComplete } from '../model/entities/controlling-report-complete.class';
@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimecontrollingReportVerificationDataService extends DataServiceFlatLeaf<ITimekeepingEmpVerificationEntity,
	IReportEntity, ControllingReportComplete> {

	public constructor(timekeepingTimeControllingReportDataService : TimekeepingTimeControllingReportDataService) {
		const options: IDataServiceOptions<ITimekeepingEmpVerificationEntity> = {
			apiUrl: 'timekeeping/recording/verification',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					const selection = timekeepingTimeControllingReportDataService.getSelection()[0];
					return { pKey1 : selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingEmpVerificationEntity,
				IReportEntity, ControllingReportComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Verification',
				parent: timekeepingTimeControllingReportDataService
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}
}
