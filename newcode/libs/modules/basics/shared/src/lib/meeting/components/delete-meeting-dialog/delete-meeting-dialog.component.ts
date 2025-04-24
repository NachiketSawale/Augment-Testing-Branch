/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { BasicsMeetingReferenceDeleteType } from '@libs/basics/interfaces';
import { PlatformCommonModule, Translatable } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MEETING_DELETION_TOKEN } from '@libs/basics/interfaces';

@Component({
	selector: 'basics-shared-meeting-delete-meeting-dialog',
	templateUrl: './delete-meeting-dialog.component.html',
	styleUrls: ['./delete-meeting-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, NgIf, NgForOf],
	standalone: true,
})
export class DeleteMeetingDialogComponent {
	/**
	 * Radio items' information.
	 */
	public radioItemInfo: IRadioItem[] = [];
	public readonly name = 'deleteType';
	public deleteType?: BasicsMeetingReferenceDeleteType;
	public includeRecurrence = false;
	private readonly deletionOption = inject(MEETING_DELETION_TOKEN);

	/**
	 * translations
	 */
	public translations = {
		deleteMeetingConfirm: 'basics.meeting.deleteMeetingConfirm',
		chooseDeleteType: 'basics.meeting.recurrence.chooseDeleteType',
	};

	/**
	 * set Radio Items
	 * @private
	 */
	private setRadioItems() {
		this.radioItemInfo = [
			{
				id: BasicsMeetingReferenceDeleteType.Current,
				displayName: 'basics.meeting.recurrence.currentOnly',
			},
			{
				id: BasicsMeetingReferenceDeleteType.CurrentAndFuture,
				displayName: 'basics.meeting.recurrence.currentAndFuture',
			},
			{
				id: BasicsMeetingReferenceDeleteType.AllMeeting,
				displayName: 'basics.meeting.recurrence.allMeeting',
			},
		];
	}

	public constructor() {
		this.setRadioItems();
		this.includeRecurrence = this.deletionOption.includeRecurrence;
	}
}

interface IRadioItem {
	/**
	 * Radio item id.
	 */
	id: number;

	/**
	 * Radio item displayName.
	 */
	displayName: Translatable;
}
