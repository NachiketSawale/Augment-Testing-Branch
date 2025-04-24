/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { BasicsMeetingDataService } from '../../services/basics-meeting-data.service';
import { ChangeMeetingStatusService } from '../../services/wizards/change-meeting-status.service';
import { ChangeAttendeeStatusService } from '../../services/wizards/change-attendee-status.service';
import { SyncMeetingToExternalService } from '../../services/wizards/sync-meeting-to-external.service';
import { BasicsSharedMeetingCreateMeetingService } from '@libs/basics/shared';

export class BasicsMeetingWizard {
	public changeMeetingStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeMeetingStatusService);
		service.onStartChangeStatusWizard();
	}

	public changeAttendeeStatus(context: IInitializationContext) {
		const service = context.injector.get(ChangeAttendeeStatusService);
		service.onStartChangeStatusWizard();
	}

	public async createMeeting(context: IInitializationContext) {
		const service = context.injector.get(BasicsSharedMeetingCreateMeetingService);
		service.showCreateDialog(undefined, undefined, async () => {
			const basicsMeetingDataService = context.injector.get(BasicsMeetingDataService);
			await basicsMeetingDataService.refreshSelected(); // todo-allen: Although this method reloads the data, it does not refresh the UI.
		});
	}

	public async synchronizeMeeting(context: IInitializationContext) {
		const service = context.injector.get(SyncMeetingToExternalService);
		service.synchronizeMeetingToOuterSystem();
	}
}
