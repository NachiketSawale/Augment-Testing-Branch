/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import * as _ from 'lodash';
import { IClosingDialogButtonEventInfo, ICustomDialog, ICustomDialogOptions, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsMeetingSection, IMeetingItem, IMtgClerkContactContextEntity, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { CreateMeetingDialogComponent } from '../../components/create-meeting-dialog/create-meeting-dialog.component';
import { BasicsMeetingSyncMeetingDataService } from '../basics-meeting-sync-meeting-data.service';
import { SyncMeetingType } from '../../model/enums/sync-meeting-type.enum';

const syncOption = [
	{ id: 0, value: 'basics.meeting.notSync' },
	{ id: 1, value: 'basics.meeting.msTeamMeeting' },
	{ id: 2, value: 'basics.meeting.msCalendarMeeting' },
];

const controlContextTemplate = {
	fieldId: '',
	readonly: false,
	validationResults: [],
	entityContext: { totalCount: 0 },
	value: new Date(),
};

const modalOptions = {
	isLoading: false,
	isRecurring: false,
	isAllDay: false,
	showTime: true,
	syncMeetingType: SyncMeetingType.NotSync,
	startDate: { ...controlContextTemplate, value: new Date() },
	endDate: { ...controlContextTemplate, value: new Date() },
	startTime: new Date(),
	endTime: new Date(),
	syncOption: syncOption,
	isEveryWeekday: false,
};

@Injectable({ providedIn: 'root' })
export class BasicsSharedMeetingCreateMeetingService {
	private readonly http = inject(PlatformHttpService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);
	private readonly syncMeetingDataService = inject(BasicsMeetingSyncMeetingDataService);

	private requiredClerks: number[] = [];
	private requiredContacts: number[] = [];
	private optionalClerks: number[] = [];
	private optionalContacts: number[] = [];
	private clerkFromContext: number[] = [];
	private contactFromContext: number[] = [];
	private bpFromContext: number | null = null;
	private projectId: number | null = null;
	private clerkFromMainData: number[] = [];
	private copyFromContextForClerk = false;
	private copyFromContextForContact = false;
	private contactFromMainData: number[] = [];
	private bpFromMainData: number | null = null;

	public meetingItem!: IMeetingItem; // The meetingItem should only be initialized in the showCreateDialog method.

	public modalOptions = modalOptions;

	public hasError() {
		if (this.modalOptions?.startDate.value && this.modalOptions?.endDate.value) {
			const diff = (this.modalOptions.endDate.value.getTime() - this.modalOptions.startDate.value.getTime()) / 1000; // in second unit.
			return diff < 0;
		}
		return false;
	}

	private getNewMeetingItem(): IMeetingItem {
		return {
			TimeZone: {TimeZoneIanaId: '', TimeZoneOffSet: 0},

			Code: this.translate.instant('cloud.common.isGenerated').text,
			Title: '',
			StartTime: null,
			EndTime: '',
			Location: '',
			URL: '',
			ProjectFk: null, // $scope.options.project ? $scope.options.project.id : null,
			TypeFk: 1,
			RequiredClerkItems: [],
			RequiredContactItems: [],
			OptionalClerkItems: [],
			OptionalContactItems: [],
			IsImportance: false,

			ClerkFK: null,
			SyncMeetingType: SyncMeetingType.NotSync,
			Recurrence: null,

			DefectFk: null,
			CheckListFk: null,
			RfqHeaderFk: null,
			QtnHeaderFk: null,
		};
	}

	// 'YYYY-MM-DD HH:mm'
	private formatDate(date: Date) {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // The month starts at 0, need to add 1.
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}`;
	}

	private processDateTime() {
		if (modalOptions.startDate.value) {
			this.meetingItem.StartTime = this.formatDate(modalOptions.startDate.value);
		}
		if (modalOptions.endDate.value) {
			this.meetingItem.EndTime = this.formatDate(modalOptions.endDate.value);
		}
	}

	private showSuccessDialog() {
		const notifyDialogConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: 'basics.meeting.wizard.createMeetingSuccess',
			buttons: [{ id: StandardDialogButtonId.Ok }],
			iconClass: 'ico-info',
		};
		this.uiCommonMsgBoxService.showMsgBox(notifyDialogConfig);
	}

	private async createMeeting(info: IClosingDialogButtonEventInfo<ICustomDialog<IMeetingItem, CreateMeetingDialogComponent, void>, void>, refreshFn: () => Promise<void>) {
		const response = await this.http.post<object>('basics/meeting/wizard/createmeeting', this.meetingItem);
		if ('Id' in response && response.Id) {
			const newMeetingItem = <IMtgHeaderEntity>response; // The 'response' is a new meeting item.

			if (newMeetingItem.Id) {
				info.dialog.value = this.meetingItem;
				info.dialog.close(StandardDialogButtonId.Ok);
				this.showSuccessDialog();

				// Refresh meeting container after creating meeting successfully.
				if (refreshFn) {
					await refreshFn();
				}

				if (modalOptions.syncMeetingType !== SyncMeetingType.NotSync) {
					await this.syncMeetingDataService.synchronizeMeetingToOuterSystem(newMeetingItem, modalOptions.syncMeetingType, refreshFn);
				}
			}
			return newMeetingItem;
		}
		return response;
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private async onOK(info: IClosingDialogButtonEventInfo<ICustomDialog<IMeetingItem, CreateMeetingDialogComponent, void>, void>, refreshFn: ()=>Promise<void>): Promise<void> {
		modalOptions.isLoading = true;
		this.processDateTime();
		this.meetingItem.SyncMeetingType = modalOptions.syncMeetingType;
		this.meetingItem.TimeZone = {
			TimeZoneIanaId: Intl.DateTimeFormat().resolvedOptions().timeZone, // get time zone iana id
			TimeZoneOffSet: new Date().getTimezoneOffset(),
		};
		/// todo temporary solution ,should multiple value here,

		if (!Array.isArray(this.meetingItem.RequiredClerkItems)) {
			// single value cae
			this.meetingItem.RequiredClerkItems = [this.meetingItem.RequiredClerkItems];
		}
		if (!Array.isArray(this.meetingItem.RequiredContactItems)) {
			this.meetingItem.RequiredContactItems = [this.meetingItem.RequiredContactItems];
		}
		if (!Array.isArray(this.meetingItem.OptionalClerkItems)) {
			this.meetingItem.OptionalClerkItems = [this.meetingItem.OptionalClerkItems];
		}
		if (!Array.isArray(this.meetingItem.OptionalContactItems)) {
			this.meetingItem.OptionalContactItems = [this.meetingItem.OptionalContactItems];
		}

		const response = await this.createMeeting(info, refreshFn);
		if (!('Id' in response && response.Id)) {
			// const meetingDates = response;
			// for (const meetingTime of meetingDates) {
			// 	meetingTime.StartTime = meetingTime.StartTime.replace('T', ' ').replace('Z', '');
			// 	meetingTime.StartTime = moment(meetingTime.StartTime).utc().format('YYYY-MM-DD HH:mm');
			// 	meetingTime.EndTime = meetingTime.EndTime.replace('T', ' ').replace('Z', '');
			// 	meetingTime.EndTime = moment(meetingTime.EndTime).utc().format('YYYY-MM-DD HH:mm');
			// }

			// The 'response' is meeting dates.
			// this.meetingItem.RecurrenceMeetingDates = meetingDates; TODO
			await this.createMeeting(info, refreshFn);
		}
		modalOptions.isLoading = false;
	}

	private getCreateMeetingModalOptions(refreshFn: () => Promise<void>) {
		const createMeetingModalOptions: ICustomDialogOptions<IMeetingItem, CreateMeetingDialogComponent> = {
			width: '600px',
			height: '800px',
			minWidth: '250px',
			resizeable: true,
			backdrop: false,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: (info) => {
						return this.meetingItem.Code === '' || modalOptions.startDate.value === undefined || modalOptions.endDate.value === undefined || this.hasError();
					},
					fn: (event, info) => {
						this.onOK(info, refreshFn);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Create Meeting', key: 'basics.meeting.wizard.createMeeting' },
			id: 'CreateMeeting',
			value: this.meetingItem,
			bodyComponent: CreateMeetingDialogComponent,
		};
		return createMeetingModalOptions;
	}

	// TODO: attendeeContext, contextData, dataService
	public async showCreateDialog(sectionId: BasicsMeetingSection | undefined, selectedParentItemId: number | undefined, refreshFn: () => Promise<void>) {
		// TODO: CloudDesktopPinningContextService not implemented yet
		// let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
		// let context = cloudDesktopPinningContextService.getContext();
		// let item =_.find(context, {'token': 'project.main'});
		// if (item){
		// 	let project = {
		// 		Id : item.id
		// 	};
		// 	this.setContextInfo(project);
		// } else if(angular.isDefined(contextData) && Object.prototype.hasOwnProperty.call(contextData, 'ProjectFk')) {
		// 	this.setContextInfo({
		// 		Id : contextData.ProjectFk
		// 	});
		// }
		//
		// if (attendeeContext && angular.isDefined(attendeeContext.clerkContext) && angular.isArray(attendeeContext.clerkContext)) {
		// 	this.setClerkFromContext(attendeeContext.clerkContext);
		// }
		//
		// if (attendeeContext && angular.isDefined(attendeeContext.contactContext) && angular.isArray(attendeeContext.contactContext)) {
		// 	this.setContactFromContext(attendeeContext.contactContext);
		// }

		this.meetingItem = this.getNewMeetingItem(); // Initialize meetingItem
		if (selectedParentItemId && sectionId) {
			switch (sectionId) {
				case BasicsMeetingSection.Defect:
					this.meetingItem.DefectFk = selectedParentItemId;
					break;
				case BasicsMeetingSection.CheckList:
					this.meetingItem.CheckListFk = selectedParentItemId;
					break;
				case BasicsMeetingSection.RfQ:
					this.meetingItem.RfqHeaderFk = selectedParentItemId;
					break;
				case BasicsMeetingSection.Quote:
					this.meetingItem.QtnHeaderFk = selectedParentItemId;
					break;
			}
		}

		// TODO: The 'project', 'contextData' and 'dataService' parameters need to be passed into the create meeting dialog component.
		// let modalOption = {
		// 	templateUrl: this.configService.appBaseUrl + 'basics.meeting/templates/meeting-create-dialog.html',
		// 	project: item,
		// 	contextData: contextData,
		// 	dataService: dataService
		// };

		const modalOptions: ICustomDialogOptions<IMeetingItem, CreateMeetingDialogComponent> = this.getCreateMeetingModalOptions(refreshFn);
		this.modalDialogService.show(modalOptions)?.finally(() => {
			this.clearAllSelected();
			this.clearContext();
		});
	}

	private setClerkFromMainData(items: number[]) {
		this.clerkFromMainData = items;
	}

	private getClerkFromMainData() {
		return this.clerkFromMainData;
	}

	private setClerkCopyFromContextStatus(status: boolean) {
		this.copyFromContextForClerk = status;
	}

	private setContactCopyFromContextStatus(status: boolean) {
		this.copyFromContextForContact = status;
	}

	public getClerkCopyFromContextStatus() {
		return this.getSelectedProjectId() !== null || this.copyFromContextForClerk;
	}

	public getContactCopyFromContextStatus() {
		return this.getSelectedProjectId() !== null || this.copyFromContextForContact;
	}

	public setRequiredClerks(items: number[]) {
		this.requiredClerks = items;
	}

	public setOptionalClerks(items: number[]) {
		this.optionalClerks = items;
	}

	private getSelectedClerks() {
		let clerkIds: number[] = [];
		clerkIds = clerkIds.concat(this.requiredClerks);
		clerkIds = clerkIds.concat(this.optionalClerks);
		return clerkIds;
	}

	public setRequiredContacts(items: number[]) {
		this.requiredContacts = items;
	}

	public setOptionalContacts(items: number[]) {
		this.optionalContacts = items;
	}

	private getSelectedContacts() {
		let contactIds: number[] = [];
		contactIds = contactIds.concat(this.requiredContacts);
		contactIds = contactIds.concat(this.optionalContacts);
		return contactIds;
	}

	public setContextInfo(projectId?: number) {
		if (!projectId) {
			// unselected project
			this.projectId = null;
			this.clearProjectRelatedContext();
			this.setClerkFromContext(this.getClerkFromMainData());
			this.setBPFromContext(this.getBPFromMainData());
			this.setContactFromContext(this.getContactFromMainData());
		} else {
			this.projectId = projectId;
			let params = new HttpParams();
			params = params.set('projectId', this.projectId);
			const url = 'basics/meeting/getprojectclerkcontactinfo';
			this.http.get<IMtgClerkContactContextEntity>(url, { params: params }).then((response) => {
				this.setClerkFromContext(response.Clerks);
				this.setContactFromContext(response.Contacts);
				this.setBPFromContext(response.BusinessPartner);
			});
		}
	}

	private getSelectedProjectId() {
		return this.projectId;
	}

	private clearAllSelected() {
		this.requiredClerks = [];
		this.requiredContacts = [];
		this.optionalClerks = [];
		this.optionalContacts = [];
		this.projectId = null;
	}

	public getClerkFromContext() {
		return this.clerkFromContext;
	}

	private setClerkFromContext(items: number[]) {
		items.forEach((item) => {
			const clerk = _.find(this.clerkFromContext, item);
			if (!clerk) {
				this.clerkFromContext.push(item);
			}
		});
	}

	public getContactFromContext() {
		return this.contactFromContext;
	}

	private setContactFromContext(items: number[]) {
		this.contactFromContext = items;
	}

	public getBPFromContext() {
		return this.bpFromContext;
	}

	private setBPFromContext(items: number | null) {
		this.bpFromContext = items;
	}

	private setBPFromMainData(items: number) {
		return (this.bpFromMainData = items);
	}

	private getBPFromMainData() {
		return this.bpFromMainData;
	}

	private setContactFromMainData(items: number[]) {
		return (this.contactFromMainData = items);
	}

	private getContactFromMainData() {
		return this.contactFromMainData;
	}

	private clearProjectRelatedContext() {
		this.clerkFromContext = [];
		this.contactFromContext = [];
		this.bpFromContext = null;
	}

	private clearContext() {
		this.clerkFromContext = [];
		this.contactFromContext = [];
		this.bpFromContext = null;
		this.copyFromContextForClerk = false;
		this.copyFromContextForContact = false;
		this.clerkFromMainData = [];
		this.bpFromMainData = null;
		this.contactFromMainData = [];
	}
}
