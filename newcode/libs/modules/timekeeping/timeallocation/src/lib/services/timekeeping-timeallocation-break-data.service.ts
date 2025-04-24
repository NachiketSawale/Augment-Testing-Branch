import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IReportEntity,ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeallocationReportComplete } from '../model/entities/timekeeping-timeallocation-report-complete.class';
import { TimekeepingTimeallocationReportDataService } from './timekeeping-timeallocation-report-data.service';
import { TimekeepingTimeallocationHeaderDataService } from './timekeeping-timeallocation-header-data.service';
import { TimekeepingTimeallocationItemDataService } from './timekeeping-timeallocation-item-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeallocationBreakDataService extends DataServiceFlatLeaf<ITimekeepingBreakEntity,
	IReportEntity, TimekeepingTimeallocationReportComplete> {
	private readonly headerDataService = inject(TimekeepingTimeallocationHeaderDataService);
	private readonly itemDataService = inject(TimekeepingTimeallocationItemDataService);
	private readonly reportDataService = inject(TimekeepingTimeallocationReportDataService);

	public constructor(timekeepingTimeallocationReportDataService : TimekeepingTimeallocationReportDataService) {
		const options: IDataServiceOptions<ITimekeepingBreakEntity> = {
			apiUrl: 'timekeeping/recording/break',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingBreakEntity, IReportEntity, TimekeepingTimeallocationReportComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Breaks',
				parent: timekeepingTimeallocationReportDataService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const item = this.itemDataService.getSelectedEntity();
		const header = this.headerDataService.getSelectedEntity();
		const selectedItem = this.reportDataService.getSelectedEntity();
		// Build the payload in the desired format
		const payload = {
			filter: '',
			PKey1: selectedItem?.Id ?? 0,
			Period: header?.PeriodFk ?? 0,
			Date: header?.AllocationDate ?? '',
			Employee: item?.EmployeeFk ?? ''
		};
		return payload;
	}

	protected override onLoadSucceeded(loaded: object): ITimekeepingBreakEntity[] {
		if (loaded) {
			return loaded as ITimekeepingBreakEntity[];
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const item = this.itemDataService.getSelectedEntity();
		const selectedHeader = this.headerDataService.getSelectedEntity();
		const selectedItem = this.reportDataService.getSelectedEntity();
		return {
			PeriodId: selectedHeader?.PeriodFk,
			JobId : selectedHeader?.JobFk,
			ProjectId : selectedHeader?.ProjectFk,
			EmployeeId : item?.EmployeeFk,
			RecordingId : item?.RecordingFk || item?.RecordingFk || null,
			Date : selectedHeader?.AllocationDate,
			PKey1 :selectedItem?.Id
		};
	}

	protected override onCreateSucceeded(created: object): IReportEntity {
		return created as unknown as IReportEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}



}
