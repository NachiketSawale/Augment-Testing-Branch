/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeallocationHeaderDataService } from '../timekeeping-timeallocation-header-data.service';
import { ITimeAllocationHeaderEntity } from '../../model/entities/time-allocation-header-entity.interface';
import { TimeAllocationHeaderComplete } from '../../model/entities/time-allocation-header-complete.class';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationStatusWizardService extends BasicsSharedChangeStatusService<IReportEntity, ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete>{

	protected readonly dataService = inject(TimekeepingTimeallocationHeaderDataService);

	protected statusConfiguration: IStatusChangeOptions<ITimeAllocationHeaderEntity, TimeAllocationHeaderComplete> = {
		title: 'timekeeping.timeallocation.timekeepingallocstatus',
		guid: '2f9936fd0ec641399cdffe45e975e5e1',
		isSimpleStatus: false,
		statusName: 'timeallocationstatus',
		checkAccessRight: true,
		statusField: 'TimeAllocationStatusFk',
		updateUrl: '',
		rootDataService: this.dataService
	};

	public setTimeAllocationStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {

	}

}
