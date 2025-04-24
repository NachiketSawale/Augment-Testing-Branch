/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { createLookup, FieldType, ICustomDialogOptions, IFormConfig, ILookupEvent, IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule, PlatformLazyInjectorService, PlatformTranslateService } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { DailyRadio, MonthlyRadio, RecurConstant, RecurRadio, RecurringMeetingDialogComponent, YearlyRadio } from '../recurring-meeting-dialog/recurring-meeting-dialog.component';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ATTENDEE_LOOKUP_OPTION_TOKEN, IMeetingItem, IModalOptions, IMtgClerkEntity, IMtgRecurrenceOption, IRecurrence, RECURRENCE_OPTION_TOKEN } from '@libs/basics/interfaces';
//import { ProjectSharedLookupService } from '@libs/project/shared';
import { BasicsSharedClerkLookupService } from '../../../lookup-services/basics-clerk-lookup.service';
import { BasicsSharedMeetingTypeLookupService } from '../../../lookup-services/customize/index';
import { BasicsSharedMeetingCreateMeetingService } from '../../services/create-meeting/basics-shared-meeting-create-meeting.service';
//import { IProjectEntity } from '@libs/project/interfaces';
import { BasicsMeetingAttendeeLookupService } from '../../lookup/basics-meeting-atteenee-lookup.service';

enum ErrorType {
	Duration,
	PatternIsNotValid,
	Date,
	AppointmentTime,
	RangeIsNotValid,
}

enum MeetingTime {
	Start,
	End,
}

/**
 * Demo Component to demonstrate form dialog.
 */
@Component({
	selector: 'basics-shared-meeting-form-dialog-copy',
	templateUrl: './create-meeting-dialog.component.html',
	styleUrls: ['./create-meeting-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule, DatePipe, NgIf, NgForOf],
	standalone: true,
})
export class CreateMeetingDialogComponent {
	public readonly translate = inject(PlatformTranslateService);
	public readonly createMeetingService = inject(BasicsSharedMeetingCreateMeetingService);
	protected MeetingTime = MeetingTime;
	public meetingItem = this.createMeetingService.meetingItem;
	public modalOptions = this.createMeetingService.modalOptions;
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public formConfig: IFormConfig<IMeetingItem> = {
		formId: 'create-meeting-form',
		showGrouping: true,
		addValidationAutomatically: false,

		groups: [
			{
				groupId: 'meeting',
				header: { key: 'basics.meeting.entityMeetingTitle' },
				open: true,
				visible: true,
				sortOrder: 1,
			},
			{
				groupId: 'required',
				header: { key: 'basics.meeting.requiredAttendee' },
				open: true,
				visible: true,
				sortOrder: 2,
			},
			{
				groupId: 'optional',
				header: { key: 'basics.meeting.optionalAttendee' },
				open: true,
				visible: true,
				sortOrder: 3,
			},
		],

		rows: [
			{
				groupId: 'meeting',
				id: 'code',
				label: { key: 'cloud.common.entityCode' },
				type: FieldType.Code,
				model: 'Code',
				sortOrder: 1,
			},
			{
				groupId: 'meeting',
				id: 'title',
				label: { key: 'basics.meeting.title' },
				type: FieldType.Description,
				model: 'Title',
				sortOrder: 2,
			},
			{
				groupId: 'meeting',
				id: 'type',
				label: { key: 'cloud.common.entityType' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({ dataServiceToken: BasicsSharedMeetingTypeLookupService, showGrid: false }),
				model: 'TypeFk', // 'MtgTypeFk'
				sortOrder: 3,
			},
			{
				groupId: 'meeting',
				id: 'location',
				label: { key: 'cloud.common.AddressTokenDesc_Location' },
				type: FieldType.Comment,
				model: 'Location',
				maxLength: 252,
				sortOrder: 4,
			},
			{
				groupId: 'meeting',
				id: 'url',
				label: { key: 'basics.meeting.meetingUrl' },
				type: FieldType.Url,
				model: 'URL',
				sortOrder: 5,
			},
			{
				groupId: 'meeting',
				id: 'isimportance',
				label: { key: 'basics.meeting.isHighImportance' },
				type: FieldType.Boolean,
				model: 'IsImportance',
				sortOrder: 6,
			},
			{
				groupId: 'meeting',
				id: 'projectfk',
				label: { key: 'cloud.common.entityProject' },
				//TODO: circular dependency：change use lazy providerToken
				type: FieldType.Integer, //FieldType.Lookup,
				// lookupOptions: createLookup({
				// 	dataServiceToken: ProjectSharedLookupService,
				// 	showDescription: true,
				// 	descriptionMember: 'ProjectName',
				// 	showClearButton: true,
				// 	events: [
				// 		{
				// 			name: 'onSelectedItemChanged',
				// 			handler: (e: ILookupEvent<IProjectEntity, IMeetingItem>) => {
				// 				const selectedId = e.selectedItem as IProjectEntity;
				// 				this.createMeetingService.setContextInfo(selectedId.Id);
				// 			},
				// 		},
				// 	],
				// }),
				model: 'ProjectFk',
				sortOrder: 7,
			},
			{
				groupId: 'meeting',
				id: 'clerkfk',
				label: { key: 'basics.meeting.entityMeetingResp' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showDescription: true,
					descriptionMember: 'Description',
					showClearButton: true,
				}),
				model: 'ClerkFk',
				sortOrder: 8,
			},

			{
				groupId: 'required',
				id: 'requiredClerkItems',
				label: { key: 'basics.meeting.entityClerk' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsMeetingAttendeeLookupService,
					showDescription: false,
					showClearButton: true,
					dialogOptions: this.prepareClerkDialogOption(),
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e: ILookupEvent<IMtgClerkEntity, IMeetingItem>) => {
								const selectedItem = e.selectedItem as IMtgClerkEntity;
								if (selectedItem) {
									this.createMeetingService.setRequiredClerks([selectedItem.Id]);
								}
							},
						},
					],
				}),
				model: 'RequiredClerkItems',
				sortOrder: 9,
			},
			{
				groupId: 'required',
				id: 'requiredContactItems',
				label: { key: 'basics.meeting.bpContact' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsMeetingAttendeeLookupService,
					showDescription: false,
					displayMember: 'FullName',
					showClearButton: true,
					dialogOptions: this.prepareContactDialogOption(),
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e: ILookupEvent<IMtgClerkEntity, IMeetingItem>) => {
								const selectedItem = e.selectedItem as IMtgClerkEntity;
								if (selectedItem) {
									this.createMeetingService.setRequiredContacts([selectedItem.Id]);
								}
							},
						},
					],
				}),
				model: 'RequiredContactItems',
				sortOrder: 10,
			},
			{
				groupId: 'optional',
				id: 'optionalClerkItems',
				label: { key: 'basics.meeting.entityClerk' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsMeetingAttendeeLookupService,
					showDescription: false,
					showClearButton: true,
					dialogOptions: this.prepareClerkDialogOption(),
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e: ILookupEvent<IMtgClerkEntity, IMeetingItem>) => {
								const selectedItem = e.selectedItem as IMtgClerkEntity;
								if (selectedItem) {
									this.createMeetingService.setOptionalClerks([selectedItem.Id]);
								}
							},
						},
					],
				}),
				model: 'OptionalClerkItems',
				sortOrder: 11,
			},
			{
				groupId: 'optional',
				id: 'optionalContactItems',
				label: { key: 'basics.meeting.bpContact' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsMeetingAttendeeLookupService,
					showDescription: false,
					displayMember: 'FullName',
					showClearButton: true,
					dialogOptions: this.prepareContactDialogOption(),
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e: ILookupEvent<IMtgClerkEntity, IMeetingItem>) => {
								const selectedItem = e.selectedItem as IMtgClerkEntity;
								if (selectedItem) {
									this.createMeetingService.setOptionalContacts([selectedItem.Id]);
								}
							},
						},
					],
				}),
				model: 'OptionalContactItems',
				sortOrder: 12,
			},
		],
	};

	private prepareContactDialogOption() {
		return {
			providers: [
				{
					provide: ATTENDEE_LOOKUP_OPTION_TOKEN,
					useValue: {
						isLookupClerk: false,
						contactFromContext: this.createMeetingService.getContactCopyFromContextStatus(),
						contextClerks: this.createMeetingService.getContactFromContext(),
						contextBp: this.createMeetingService.getBPFromContext(),
					},
				},
			],
			headerText: {
				text: 'Assign Contact',
				key: 'basics.meeting.dialogTitleContact',
			},
		};
	}

	private prepareClerkDialogOption() {
		return {
			providers: [
				{
					provide: ATTENDEE_LOOKUP_OPTION_TOKEN,
					useValue: {
						isLookupClerk: true,
						contactFromContext: this.createMeetingService.getClerkCopyFromContextStatus(),
						contextClerks: this.createMeetingService.getClerkFromContext(),
					},
				},
			],
			headerText: {
				text: 'Assign Clerk',
				key: 'basics.meeting.dialogTitleClerk',
			},
		};
	}

	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);

	private modalDialogService = inject(UiCommonDialogService);

	protected recurrence: IRecurrence | null = null;

	protected readonly FieldType = FieldType;

	private errorConfigurations: { [key in ErrorType]: { headerText: string; bodyText: string } } = {
		[ErrorType.Duration]: {
			headerText: 'basics.meeting.recurrence.recurrencePattern',
			bodyText: 'basics.meeting.recurrence.recurrencePatternErrorMessage',
		},
		[ErrorType.PatternIsNotValid]: {
			headerText: 'basics.meeting.recurrence.recurrencePattern',
			bodyText: 'basics.meeting.recurrence.patternIsNotValid',
		},
		[ErrorType.Date]: {
			headerText: 'basics.meeting.recurrence.rangeOfRecurrence',
			bodyText: 'basics.meeting.recurrence.recurrenceRangeErrorMessage',
		},
		[ErrorType.AppointmentTime]: {
			headerText: 'basics.meeting.recurrence.appointmentTime',
			bodyText: 'basics.meeting.recurrence.appointmentTimeErrorMessage',
		},
		[ErrorType.RangeIsNotValid]: {
			headerText: 'basics.meeting.recurrence.rangeOfRecurrence',
			bodyText: 'basics.meeting.recurrence.rangeIsNotValid',
		},
	};

	public constructor() {
		this.initModalOptions();

		// TODO: Get typeFK default value. Complete it after basicsLookupDataLookupDescriptorService ready.
		// let defaultTypeItems = _.filter(lookupDescriptorService.getData('MeetingType'), {IsDefault: true});
		// if (angular.isArray(defaultTypeItems) && defaultTypeItems.length >= 1) {
		// 	typeFk = defaultTypeItems[0].Id;
		// }
	}

	private initModalOptions() {
		this.modalOptions.isLoading = false;
		this.modalOptions.isRecurring = false;
		this.modalOptions.isAllDay = false;
		this.modalOptions.showTime = true;
		this.modalOptions.isEveryWeekday = false;
		const start = new Date();
		const end = new Date();
		start.setSeconds(0, 0);
		end.setMinutes(start.getMinutes() + 30, 0, 0);
		this.modalOptions.startDate.value = start;
		this.modalOptions.endDate.value = end;
		this.modalOptions.startTime = start;
		this.modalOptions.endTime = end;
	}

	public updateTime($event: Event, mode: number) {
		const value = (<HTMLInputElement>$event.target).value;
		const [hours, minutes] = value.split(':').map(Number);

		if (mode === MeetingTime.Start) {
			this.modalOptions.startDate.value?.setHours(hours, minutes, 0, 0);
			this.modalOptions.startTime.setHours(hours, minutes, 0, 0);
		} else {
			this.modalOptions.endDate.value?.setHours(hours, minutes, 0, 0);
			this.modalOptions.endTime.setHours(hours, minutes, 0, 0);
		}
	}

	public onAllDateClick() {
		this.modalOptions.isAllDay = !this.modalOptions.isAllDay;
		if (this.modalOptions.isAllDay) {
			this.modalOptions.startDate.value.setHours(0, 0);
			this.modalOptions.endDate.value.setDate(this.modalOptions.endDate.value.getDate());
			this.modalOptions.endDate.value.setHours(0, 0);
		}
	}

	public hasError = this.createMeetingService.hasError;

	/** Open recurring meeting form dialog.
	 * */
	public async openRecurringDialog() {
		const data: IMtgRecurrenceOption = {
			isAllDay: this.modalOptions.isAllDay,
			// syncMeetingType: this.modalOptions.syncMeetingType,
			startDate: this.modalOptions.startDate.value,
			endDate: this.modalOptions.endDate.value,
			startTime: this.modalOptions.startTime,
			endTime: this.modalOptions.endTime,
			isEveryWeekday: this.modalOptions.isEveryWeekday,

			modalOptions: null,
			recurrence: this.recurrence,
		};

		const recurrenceModalOptions: ICustomDialogOptions<IMtgRecurrenceOption, RecurringMeetingDialogComponent> = {
			width: '600px',
			// minWidth: '250px',

			resizeable: false,
			backdrop: false,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: async (event, info) => {
						if (info.dialog.value) {
							this.onOk(info.dialog.value.modalOptions, info.dialog.value.recurrence)?.then((result) => {
								if (result) {
									this.modalOptions.startDate.value = result.startDate;
									this.modalOptions.startTime = result.startTime;
									this.modalOptions.endDate.value = result.endDate;
									this.modalOptions.endTime = result.endTime;

									this.recurrence = result.recurrence;
									this.modalOptions.isEveryWeekday = result.isEveryWeekday;
									if (this.modalOptions.isAllDay) {
										this.modalOptions.isAllDay = result.isAllDay;
									}

									this.modalOptions.isRecurring = result.recurrence !== null;
									info.dialog.close(StandardDialogButtonId.Ok);
								}
							});
						}
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
				{
					id: StandardDialogButtonId.Retry,
					caption: { key: 'basics.meeting.recurrence.removeRecurrence' },
					isDisabled: (info) => this.recurrence === null,
					fn: (event, info) => {
						this.recurrence = null;
						this.modalOptions.isRecurring = false;
						info.dialog.close(StandardDialogButtonId.Retry);
					},
				},
			],

			headerText: { key: 'basics.meeting.recurrence.appointmentRecurrence' },
			id: 'MakeRecurring',
			value: data,
			bodyProviders: [{ provide: RECURRENCE_OPTION_TOKEN, useValue: data }],
			bodyComponent: RecurringMeetingDialogComponent,
		};

		await this.modalDialogService.show(recurrenceModalOptions);
	}

	private calEndDate(modalOptions: IModalOptions) {
		if (modalOptions.duration !== null && modalOptions.startTime !== null) {
			const [duration, durationUnit] = modalOptions.duration.split(' ');
			const startTime = modalOptions.recurrenceRange.startDate.value as Date;
			startTime.setHours(modalOptions.startTime.getHours(), modalOptions.startTime.getMinutes());
			const end = new Date(startTime);
			if (durationUnit.includes('hour')) {
				// 'basics.meeting.recurrence.hour' or 'basics.meeting.recurrence.hours'
				end.setHours(startTime.getHours() + parseInt(duration));
			} else if (durationUnit.includes('day')) {
				// 'basics.meeting.recurrence.day' or 'basics.meeting.recurrence.days'
				end.setDate(startTime.getDate() + parseInt(duration));
			} else if (durationUnit.includes('week')) {
				// 'basics.meeting.recurrence.week' or 'basics.meeting.recurrence.weeks'
				end.setDate(startTime.getDay() + parseInt(duration) * 7);
			}

			return end;
		} else {
			throw Error(); // The code should not be executed.
		}
	}

	private processRecurrencePattern(modalOptions: IModalOptions, recurrence: IRecurrence) {
		recurrence.pattern.interval = parseInt(modalOptions.recurrencePattern.interval); // TODO

		switch (modalOptions.recurrencePatternType.value) {
			case RecurRadio.Daily:
				recurrence.pattern.type = RecurConstant.pattern.daily;
				if (modalOptions.recurrencePattern.dailyRadio === DailyRadio.EveryWeekday) {
					modalOptions.recurrencePattern.isEveryWeekday = true;
					recurrence.pattern.type = RecurConstant.pattern.weekly;
					recurrence.pattern.interval = 1;
					recurrence.pattern.daysOfWeek = [1, 2, 3, 4, 5];
				}
				break;
			case RecurRadio.Weekly:
				recurrence.pattern.type = RecurConstant.pattern.weekly;

				for (let i = 0; i < modalOptions.weekOption.length; i++) {
					if (modalOptions.weekOption[i].state.value === true) {
						modalOptions.recurrencePattern.daysOfWeek.push(modalOptions.weekOption[i].id);
					}
				}
				recurrence.pattern.daysOfWeek = modalOptions.recurrencePattern.daysOfWeek;
				break;
			case RecurRadio.Monthly:
				if (modalOptions.recurrencePattern.monthlyRadio === MonthlyRadio.AbsoluteDay) {
					recurrence.pattern.type = RecurConstant.pattern.absoluteMonthly;
					recurrence.pattern.dayOfMonth = parseInt(modalOptions.recurrencePattern.dayOfMonth);
				} else {
					recurrence.pattern.type = RecurConstant.pattern.relativeMonthly;
					for (const index of modalOptions.frequencyOption) {
						if (index.id === parseInt(modalOptions.recurrencePattern.index)) {
							recurrence.pattern.index = index.id;
						}
					}
					for (const day of modalOptions.weekOption) {
						if (day.id === parseInt(modalOptions.recurrencePattern.day)) {
							modalOptions.recurrencePattern.daysOfWeek.push(day.id);
						}
					}
					recurrence.pattern.daysOfWeek = modalOptions.recurrencePattern.daysOfWeek;
				}
				break;
			case RecurRadio.Yearly:
				if (modalOptions.recurrencePattern.yearlyRadio === YearlyRadio.AbsoluteDay) {
					recurrence.pattern.type = RecurConstant.pattern.absoluteYearly;
					recurrence.pattern.dayOfMonth = parseInt(modalOptions.recurrencePattern.dayOfMonth);

					for (const month of modalOptions.monthOption) {
						if (month.id === parseInt(modalOptions.recurrencePattern.month1)) {
							recurrence.pattern.month = month.id + 1;
						}
					}
				} else {
					recurrence.pattern.type = RecurConstant.pattern.relativeYearly;
					for (const index of modalOptions.frequencyOption) {
						if (index.id === parseInt(modalOptions.recurrencePattern.index)) {
							recurrence.pattern.index = index.id;
						}
					}
					for (const day of modalOptions.weekOption) {
						if (day.id === parseInt(modalOptions.recurrencePattern.day)) {
							modalOptions.recurrencePattern.daysOfWeek.push(day.id);
						}
					}
					recurrence.pattern.daysOfWeek = modalOptions.recurrencePattern.daysOfWeek;

					for (const month of modalOptions.monthOption) {
						if (month.id === parseInt(modalOptions.recurrencePattern.month2)) {
							recurrence.pattern.month = month.id + 1;
						}
					}
				}
				break;
			default:
				break;
		}
	}

	private processRecurrenceRange(modalOptions: IModalOptions, recurrence: IRecurrence) {
		if (modalOptions.recurrenceRange.startDate.value) {
			// this.recurrence.range.startDate = this.modalOptions.recurrenceRange.startDate.format('YYYY-MM-DD');
			recurrence.range.startDate = modalOptions.recurrenceRange.startDate.value as Date;

			if (modalOptions.recurrenceRange.type === 1) {
				recurrence.range.type = RecurConstant.range.endDate;
				if (modalOptions.recurrenceRange.endDate) {
					// this.recurrence.range.endDate = this.modalOptions.recurrenceRange.endDate.format('YYYY-MM-DD');
					recurrence.range.endDate = modalOptions.recurrenceRange.endDate.value as Date;
				}
			} else {
				recurrence.range.type = RecurConstant.range.numbered;
				recurrence.range.numberOfOccurrences = parseInt(modalOptions.recurrenceRange.numberOfOccurrences);
			}
		}
	}

	private estimatePattern(modalOptions: IModalOptions, recurrence: IRecurrence) {
		const [duration, durationUnit] = modalOptions.duration.split(' ');

		let durHours = null;
		if (durationUnit.includes('hour')) {
			durHours = parseInt(duration);
		} else if (durationUnit.includes('day')) {
			durHours = parseInt(duration) * 24;
		} else if (durationUnit.includes('week')) {
			durHours = parseInt(duration) * 7 * 24;
		}

		if (durHours !== null) {
			if (recurrence.pattern.type === RecurConstant.pattern.daily) {
				if (durHours > recurrence.pattern.interval * 24) {
					this.showErrorDialog(ErrorType.Duration);
					return false;
				}
			} else if (recurrence.pattern.type === RecurConstant.pattern.weekly) {
				if (durHours > recurrence.pattern.interval * 7 * 24) {
					this.showErrorDialog(ErrorType.Duration);
					return false;
				}
			}

			if (modalOptions.recurrencePatternType.value === RecurRadio.Daily && modalOptions.recurrencePattern.dailyRadio === DailyRadio.EveryWeekday) {
				if (durHours > recurrence.pattern.interval * 5 * 24) {
					this.showErrorDialog(ErrorType.Duration);
					return false;
				}
			}
		}

		return true;
	}

	private showErrorDialog(type: ErrorType) {
		const errorConfig = this.errorConfigurations[type];
		if (!errorConfig) {
			throw Error();
		}
		const errorDialogConfig: IMessageBoxOptions = {
			headerText: errorConfig.headerText,
			bodyText: errorConfig.bodyText,
			iconClass: 'ico-error',
			buttons: [{ id: StandardDialogButtonId.Cancel }],
		};

		this.uiCommonMsgBoxService.showMsgBox(errorDialogConfig);
	}

	private async onOk(modalOptions: IModalOptions | null, recurrence: IRecurrence | null) {
		if (modalOptions == null || recurrence == null) {
			throw Error();
		}

		if (!modalOptions.startTime || !modalOptions.endTime) {
			this.showErrorDialog(ErrorType.AppointmentTime);
			return null;
		}

		if (!modalOptions.recurrenceRange.startDate.value || (!modalOptions.recurrenceRange.endDate.value && modalOptions.recurrenceRange.type === RecurConstant.range.endDate)) {
			this.showErrorDialog(ErrorType.Date);
			return null;
		}

		if (modalOptions.recurrenceRange.type === RecurConstant.range.endDate && (modalOptions.recurrenceRange.endDate.value as Date).getTime() - (modalOptions.recurrenceRange.startDate.value as Date).getTime() < 0) {
			this.showErrorDialog(ErrorType.RangeIsNotValid);
			return null;
		}

		this.processRecurrencePattern(modalOptions, recurrence);
		this.processRecurrenceRange(modalOptions, recurrence);

		if (recurrence.pattern.type === RecurConstant.pattern.weekly && recurrence.pattern.daysOfWeek.length < 1) {
			this.showErrorDialog(ErrorType.PatternIsNotValid);
			return null;
		}

		if (recurrence.pattern.type === RecurConstant.pattern.absoluteYearly) {
			const year = new Date().getFullYear();
			const day = new Date(year, recurrence.pattern.month, 0).getDate();
			if (day < recurrence.pattern.dayOfMonth) {
				this.showErrorDialog(ErrorType.PatternIsNotValid);
				return null;
			}
		}

		const endDate = this.calEndDate(modalOptions);
		const data: IMtgRecurrenceOption = {
			isEveryWeekday: modalOptions.recurrencePattern.isEveryWeekday,
			startDate: modalOptions.recurrenceRange.startDate.value as Date, // If 'startDate' is null, an error message should pop up.
			endDate: endDate, // If 'endDate' is null, an error message should pop up.
			startTime: modalOptions.startTime,
			endTime: modalOptions.endTime,
			isAllDay: (modalOptions.endTime.getTime() - modalOptions.startTime.getTime()) / 1000 / 60 / 60 === 24,

			recurrence: recurrence,
			modalOptions: modalOptions,
		};

		if (this.estimatePattern(modalOptions, recurrence)) {
			if (recurrence.pattern.type === RecurConstant.pattern.absoluteMonthly && recurrence.pattern.dayOfMonth > 28) {
				const notifyDialogConfig: IMessageBoxOptions = {
					headerText: 'basics.meeting.recurrence.recurrencePattern',
					bodyText: this.translate.instant('basics.meeting.recurrence.recurrencePatternNotify', { number: recurrence.pattern.dayOfMonth }),
					buttons: [{ id: StandardDialogButtonId.Ok }],
					iconClass: 'ico-warning',
				};
				this.uiCommonMsgBoxService.showMsgBox(notifyDialogConfig)?.then(() => {
					return data;
				});
			} else {
				return data;
			}
		}
		return null;
	}
}
