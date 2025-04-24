/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeallocationReportDataService } from '../timekeeping-timeallocation-report-data.service';
import { ITimeAllocationHeaderEntity } from '../../model/entities/time-allocation-header-entity.interface';
import { TimeAllocationHeaderComplete } from '../../model/entities/time-allocation-header-complete.class';
import { TimekeepingTimeallocationHeaderDataService } from '../timekeeping-timeallocation-header-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationRepotStatusWizardService extends BasicsSharedChangeStatusService<IReportEntity, ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete>{

	protected readonly dataService = inject(TimekeepingTimeallocationReportDataService);
	protected readonly rootDataService = inject(TimekeepingTimeallocationHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete> = {
		title: 'basics.customize.timekeepingreportstatus',
		guid: '3648738db0f24eb08b67af4ce31c5f7a',
		isSimpleStatus: false,
		statusName: 'recordingreportstatus',
		checkAccessRight: true,
		statusField: 'ReportStatusFk',
		updateUrl: '',
		rootDataService: this.rootDataService
	};

	public setReportStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {

	}

}
