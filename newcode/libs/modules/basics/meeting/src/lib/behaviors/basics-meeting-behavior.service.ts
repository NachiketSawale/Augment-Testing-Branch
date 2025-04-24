/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { InsertPosition, ItemType } from '@libs/ui/common';
import { BasicsSharedMeetingCreateMeetingService } from '@libs/basics/shared';
import { BasicsMeetingDataService } from '../services/basics-meeting-data.service';

export const BASICS_MEETING_BEHAVIOR_TOKEN = new InjectionToken<BasicsMeetingBehavior>('basicsMeetingBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingBehavior implements IEntityContainerBehavior<IGridContainerLink<IMtgHeaderEntity>, IMtgHeaderEntity> {
	public createMeetingDialogService = inject(BasicsSharedMeetingCreateMeetingService);

	private readonly basicsMeetingDataService = inject(BasicsMeetingDataService);

	public onCreate(containerLink: IGridContainerLink<IMtgHeaderEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				id: EntityContainerCommand.CreateRecord,
				caption: { text: 'Create', key: 'cloud.common.taskBarNewRecord' },
				sort: 0,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-new',
				fn: async () => {
					await this.createMeetingDialogService.showCreateDialog(undefined, undefined, async () => {
						await this.basicsMeetingDataService.refreshSelected(); // todo-allen: Although this method reloads the data, it does not refresh the UI.
					});
				},
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
	}
}
