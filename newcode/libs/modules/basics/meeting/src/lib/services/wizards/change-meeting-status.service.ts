/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { BasicsMeetingDataService } from '../basics-meeting-data.service';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsMeetingComplete } from '../../model/basics-meeting-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeMeetingStatusService extends BasicsSharedChangeStatusService<IMtgHeaderEntity, IMtgHeaderEntity, BasicsMeetingComplete> {
	protected readonly dataService = inject(BasicsMeetingDataService);

	protected statusConfiguration: IStatusChangeOptions<IMtgHeaderEntity, BasicsMeetingComplete> = {
		title: 'Change Meeting Status',
		guid: 'e5f2d7cf403f41a2ab54cd1e69c89bc8',
		isSimpleStatus: false,
		statusName: 'meeting',
		checkAccessRight: true,
		statusField: 'MtgStatusFk',
		updateUrl: 'basics/meeting/wizard/changemeetingstatus'
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}