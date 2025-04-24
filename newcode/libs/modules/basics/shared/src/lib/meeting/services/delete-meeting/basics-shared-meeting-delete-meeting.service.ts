/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsMeetingReferenceDeleteType, IMtgHeaderEntity, MEETING_DELETION_TOKEN } from '@libs/basics/interfaces';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { DeleteMeetingDialogComponent } from '../../components/delete-meeting-dialog/delete-meeting-dialog.component';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({ providedIn: 'root' })
export class BasicsSharedMeetingDeleteMeetingService {
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly http = inject(PlatformHttpService);

	/**
	 * assign delete Meeting
	 * @param entities
	 */
	public deleteMeeting(entities: IMtgHeaderEntity[] | IMtgHeaderEntity): IMtgHeaderEntity[] | null {
		let deleteEntities: IMtgHeaderEntity[] = [];
		if (!Array.isArray(entities)) {
			deleteEntities.push(entities);
		} else {
			deleteEntities = entities;
		}
		const recurrenceMeetings: IMtgHeaderEntity[] = [];
		const normalMeetings: IMtgHeaderEntity[] = [];
		this.assignItems(deleteEntities, normalMeetings, recurrenceMeetings);
		this.modalDialogService.show(this.getDeleteMeetingModalOptions(recurrenceMeetings.length > 0))?.then((result) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok) {
				if (result.value) {
					/// include recurrence case
					this.doDeleteRecurrence(result.value as number, recurrenceMeetings);
					return normalMeetings;
				} else {
					return deleteEntities;
				}
			}
			return null;
		});

		return null;
	}

	/**
	 * assign items to normalMeeting and recurrenceMeeting
	 * @param entities
	 * @param normalMeetings
	 * @param recurrenceMeetings
	 * @private
	 */
	private assignItems(entities: IMtgHeaderEntity[], normalMeetings: IMtgHeaderEntity[], recurrenceMeetings: IMtgHeaderEntity[]) {
		entities.forEach((item) => {
			if (item.Recurrence) {
				recurrenceMeetings.push(item);
			} else {
				normalMeetings.push(item);
			}
		});
	}

	/**
	 * delete recurrence meeting
	 * @param type
	 * @param entities
	 * @private
	 */
	private doDeleteRecurrence(type: BasicsMeetingReferenceDeleteType, entities: IMtgHeaderEntity[]) {
		const itemIds = entities.map((value) => value.Id);
		if (itemIds.length > 0) {
			const deleteData = { ItemIds: itemIds, type: type };
			this.http.post('basics/meeting/delete/recurrencemeetings', deleteData).then((result) => {
				/// todo refresh gird
				/// todo do  setSpecificationAsModified??
				// If the Minutes text was modified but was not saved before deleting the meeting item,
				// set modifiedSpecification to null to avoid calling the 'update' API.
				// let childServices = dataService.getChildServices();
				// _.forEach(childServices, function (childService) {
				// 	if (childService.setSpecificationAsModified) {
				// 		childService.setSpecificationAsModified(null);
				// 	}
				// });
			});
		}
	}

	/**
	 * get delete meeting ModalOptions
	 * @param includeRecurrence
	 * @private
	 */
	private getDeleteMeetingModalOptions(includeRecurrence: boolean) {
		const deleteMeetingModalOptions: ICustomDialogOptions<number | undefined, DeleteMeetingDialogComponent> = {
			resizeable: true,
			backdrop: false,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: (info) => {
						return includeRecurrence && !info.dialog.body.deleteType;
					},
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.deleteType;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Delete Meeting', key: 'basics.meeting.deleteMeetingTitle' },
			id: 'DeleteMeeting',
			bodyComponent: DeleteMeetingDialogComponent,
			bodyProviders: [
				{
					provide: MEETING_DELETION_TOKEN,
					useValue: {
						includeRecurrence: includeRecurrence,
					},
				},
			],
		};
		return deleteMeetingModalOptions;
	}
}
