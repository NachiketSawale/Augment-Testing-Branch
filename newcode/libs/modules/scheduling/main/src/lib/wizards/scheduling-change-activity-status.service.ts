/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { ActivityComplete } from '../model/activity-complete.class';

@Injectable({
	providedIn: 'root',
})
export class SchedulingChangeActivityStatusService extends BasicsSharedChangeStatusService<IActivityEntity, IActivityEntity, ActivityComplete> {
	protected configurationService = inject(PlatformConfigurationService);
	protected readonly dataService = inject(SchedulingMainDataService);

	protected statusConfiguration: IStatusChangeOptions<IActivityEntity, ActivityComplete> = {
		title: 'scheduling.main.changeActivityState',
		guid: 'adcc6022ce2a4fa1a1bef5d720f800e7',
		isSimpleStatus: false,
		statusName: 'scheduling',
		checkAccessRight: true,
		statusField: 'ActivityStateFk',
		updateUrl: 'scheduling/main/activity/changestatus',
		rootDataService: this.dataService
		//ToDo statusProviderFunc
      // /**
		//  * provide status function
		//  */
		// statusProviderFunc?(): Observable<IStatus[]>
	};
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}


}