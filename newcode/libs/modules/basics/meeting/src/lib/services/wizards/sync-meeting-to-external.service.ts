/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsMeetingDataService } from '../basics-meeting-data.service';
import { BasicsMeetingSyncMeetingDataService } from '@libs/basics/shared';

@Injectable({ providedIn: 'root' })
export class SyncMeetingToExternalService {
	private readonly dataService = inject(BasicsMeetingDataService);

	private readonly syncMeetingDataService = inject(BasicsMeetingSyncMeetingDataService);

	public async synchronizeMeetingToOuterSystem() {
		const selectedEntity = this.dataService.getSelectedEntity();
		await this.syncMeetingDataService.synchronizeMeetingToOuterSystem(selectedEntity, null, async () => {
			await this.dataService.refreshSelected(); // todo-allen: Although this method reloads the data, it does not refresh the UI.
		});
	}
}
