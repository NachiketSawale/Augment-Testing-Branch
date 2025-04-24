/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IMtgAttendeeEntity, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { GetHttpOptions, PlatformHttpService, PlatformTranslateService, PostHttpOptions } from '@libs/platform/common';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { SyncMeetingType } from '../model/enums/sync-meeting-type.enum';
import { BasicsSharedMeetingStatusLookupService } from '../../lookup-services/customize/meeting/basics-shared-meeting-status-lookup.service';

type refreshFn = () => Promise<void>;

/**
 * todo-allen: The msalAuthenticationCustomService is not implemented.
 * The msalAuthenticationCustomMockService is a mock service for the msalAuthenticationCustomService.
 * After implementing the msalAuthenticationCustomService,
 * this service should be removed and use msalAuthenticationCustomService instead of it.
 */
class msalAuthenticationCustomMockService {
	public constructor(private clientId: string) {}

	public isAuthenticated(account: string | null, request: object, showPopupIfNeed = true) {
		return true;
	}

	public async loginPopup(account: string | null, request: object) {
		//
	}
}

@Injectable({ providedIn: 'root' })
export class BasicsMeetingSyncMeetingDataService {
	private readonly http = inject(PlatformHttpService);

	private readonly translate = inject(PlatformTranslateService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private readonly formDialogService = inject(UiCommonFormDialogService);

	private readonly meetingStatusLookupService = inject(BasicsSharedMeetingStatusLookupService);

	private readonly infoHeaderText: string = 'cloud.common.infoBoxHeader';

	private readonly errorHeaderText: string = 'cloud.common.errorDialogTitle';

	private readonly syncMeetingTypeOptions: { id: number; description: string }[] = [
		{ id: 1, description: this.translate.instant('basics.meeting.msTeamMeeting').text },
		{ id: 2, description: this.translate.instant('basics.meeting.msCalendarMeeting').text },
	];

	private async showInfo(bodyText: string) {
		return this.messageBoxService.showMsgBox(bodyText, this.infoHeaderText, 'info');
	}

	private async showError(bodyText: string) {
		return this.messageBoxService.showMsgBox(bodyText, this.errorHeaderText, 'error');
	}

	private showHasPublishedInfo() {
		return this.showInfo('basics.meeting.wizard.hasPublished');
	}

	private async showAttendNotFoundInfo() {
		return await this.showInfo('basics.meeting.wizard.attendNotFound');
	}

	private async showAttendNoEmailInfo() {
		return await this.showInfo('basics.meeting.wizard.attendNoEmail');
	}

	private async showSyncSuccessButHasNoOnlineUrlError() {
		await this.showError('basics.meeting.wizard.syncSuccessButHasNoOnlineURL');
	}

	private async showSyncFailedError(message: unknown) {
		let bodyText = this.translate.instant('basics.meeting.wizard.syncFailed').text;
		if (message) {
			bodyText = `${bodyText}: ${message.toString()}`; // todo-allen: segment text.
		}
		await this.showError(bodyText);
	}

	private async showSyncSuccessInfo(noEmailUser: string[]) {
		const bodyText = noEmailUser.length > 0 ? `${this.translate.instant('basics.meeting.wizard.partialUser').text} ${noEmailUser.toString()}` : 'basics.meeting.wizard.syncSuccess';
		return await this.showInfo(bodyText);
	}

	private async showChooseMeetingTypeDialog(isDisabledOkBtn: boolean = false) {
		const formConfig: IFormConfig<{ id: number; description: string }> = {
			formId: 'basics.meeting.synchronizeMeetingModal',
			rows: [
				{
					id: 'syncMeetingType',
					label: { key: 'basics.meeting.wizard.selectSyncMeetingType' },
					type: FieldType.InputSelect,
					model: 'description',
					options: {
						items: this.syncMeetingTypeOptions,
						valueMember: 'id', // todo-allen: It seems that the valueMember is not taking effect.
						displayMember: 'description',
						inputDomain: 'Description',
					},
					readonly: true,
				},
			],
		};

		return this.formDialogService.showDialog({
			headerText: 'basics.meeting.wizard.syncMeetingToExternal',
			bottomDescription: 'basics.meeting.wizard.syncNote',
			formConfiguration: formConfig,
			entity: { id: 1, description: this.translate.instant('basics.meeting.msTeamMeeting').text },
			// customButtons: [{id: StandardDialogButtonId.Ok, caption: {key: 'cloud.common.ok'}, isDisabled: isDisabledOkBtn}],
			showOkButton: !isDisabledOkBtn, // todo-allen: It seems that the OK button cannot be disabled; it can only be hidden.
		});
	}

	private async syncMeetingAsync(selectedItem: IMtgHeaderEntity, syncMeetingType: SyncMeetingType, noEmailUser: string[], refreshFn?: refreshFn) {
		const data = { mainItemId: selectedItem.Id, syncMeetingType: syncMeetingType };
		const httpOptions: PostHttpOptions = {
			headers: { 'x-request-office-byapi': 'globals.aad.resource.msGraph' + '/v1.0' }, // todo-allen: Wait globals.aad.resource.msGraph to be implemented.
		};
		const response = await this.http.post<IMtgHeaderEntity>('basics/meeting/wizard/syncMeeting', data, httpOptions);
		if (response) {
			if (syncMeetingType === SyncMeetingType.Online && !response.MtgUrl) {
				await this.showSyncSuccessButHasNoOnlineUrlError();
			} else {
				await this.showSyncSuccessInfo(noEmailUser);
			}
			if (refreshFn) {
				await refreshFn(); // refresh UI.
			}
		} else {
			await this.showSyncFailedError('');
		}
	}

	private async syncMeetingAfterLogin(selectedItem: IMtgHeaderEntity, syncMeetingType: SyncMeetingType | null, noEmailUser: string[], refreshFn?: refreshFn) {
		if (syncMeetingType === null) {
			const result = await this.showChooseMeetingTypeDialog();
			if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				syncMeetingType =
					this.syncMeetingTypeOptions.find((e) => {
						return e.description === result.value?.description;
					})?.id ?? null; // todo-allen: The valueMember is not taking effect.
			}
		}
		if (syncMeetingType !== null && syncMeetingType !== SyncMeetingType.NotSync) {
			await this.syncMeetingAsync(selectedItem, syncMeetingType, noEmailUser, refreshFn);
		}
	}

	private async showSyncMeetingDialog(selectedItem: IMtgHeaderEntity, syncMeetingType: SyncMeetingType | null, refreshFn?: refreshFn) {
		const httpOptions: GetHttpOptions = { params: { mainItemId: selectedItem.Id } };
		const attendeeItems = await this.http.get<IMtgAttendeeEntity[]>('basics/meeting/attendee/list', httpOptions);
		if (attendeeItems.length === 0) {
			return this.showAttendNotFoundInfo();
		}

		const emails: string[] = [];
		const noEmailUser: string[] = [];
		for (const attendee of attendeeItems) {
			if (attendee.Email && attendee.Email !== '') {
				emails.push(attendee.Email);
			} else {
				noEmailUser.push(attendee.FirstName + ' ' + attendee.FamilyName);
			}
		}

		if (emails.length === 0) {
			return await this.showAttendNoEmailInfo();
		}

		// todo-allen: Wait msalAuthenticationCustomService to be implemented.
		// todo-allen: Wait globals.aad.office365ClientId to be implemented.
		const client = new msalAuthenticationCustomMockService('globals.aad.office365ClientId');
		const request = { scopes: ['Calendars.ReadWrite', 'Files.ReadWrite'] };
		const isAuthenticated = client.isAuthenticated(null, request);
		if (isAuthenticated) {
			return await this.syncMeetingAfterLogin(selectedItem, syncMeetingType, noEmailUser, refreshFn);
		} else {
			try {
				await client.loginPopup(null, request);
				return await this.syncMeetingAfterLogin(selectedItem, syncMeetingType, noEmailUser, refreshFn);
			} catch (e) {
				return await this.showSyncFailedError(this.translate.instant('basics.meeting.wizard.acquireTokenFailed').text);
			}
		}
	}

	/**
	 * Synchronize meetings to external systems: MS Teams (online meeting) or MS Calendar (offline meeting).
	 * @param selectedItem The meeting entity.
	 * @param syncMeetingType Indicates the meeting type: online meeting, offline meeting or no need for meeting synchronization.
	 * @param refreshFn Call this callback function to refresh the meeting container after the meeting synchronization is completed.
	 */
	public async synchronizeMeetingToOuterSystem(selectedItem: IMtgHeaderEntity | null, syncMeetingType: SyncMeetingType | null, refreshFn: refreshFn) {
		await this.showSyncFailedError('This is a error test.');

		try {
			if (!selectedItem) {
				await this.showChooseMeetingTypeDialog(!selectedItem); // ok button is disabled.
				return;
			}

			const isPublished = (await firstValueFrom(this.meetingStatusLookupService.getItemByKey({ id: selectedItem.MtgStatusFk }))).IsPublished;
			if (isPublished) {
				const result = await this.showHasPublishedInfo();
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					await this.showSyncMeetingDialog(selectedItem, syncMeetingType, refreshFn);
				}
			} else {
				await this.showSyncMeetingDialog(selectedItem, syncMeetingType, refreshFn);
			}
		} catch (error) {
			await this.showSyncFailedError(error);
			throw error;
		}
	}
}
