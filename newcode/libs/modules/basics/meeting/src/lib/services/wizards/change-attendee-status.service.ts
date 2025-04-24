/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IMtgAttendeeEntity, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsMeetingAttendeeDataService } from '../basics-meeting-attendee-data.service';
import { BasicsMeetingDataService } from '../basics-meeting-data.service';
import { BasicsMeetingComplete } from '../../model/basics-meeting-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeAttendeeStatusService extends BasicsSharedChangeStatusService<IMtgAttendeeEntity, IMtgHeaderEntity, BasicsMeetingComplete> {
	protected readonly dataService = inject(BasicsMeetingAttendeeDataService);
	protected readonly rootDataService = inject(BasicsMeetingDataService);

	protected statusConfiguration: IStatusChangeOptions<IMtgHeaderEntity, BasicsMeetingComplete> = {
		title: 'Change Attendee Status',
		guid: '92a14f1359b249659F558aD2169909e0',
		isSimpleStatus: false,
		statusName: 'attendee',
		checkAccessRight: true,
		statusField: 'AttendeeStatusFk',
		updateUrl: 'basics/meeting/wizard/changeattendeestatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		// TODO: refresh the selected entities
	}
}