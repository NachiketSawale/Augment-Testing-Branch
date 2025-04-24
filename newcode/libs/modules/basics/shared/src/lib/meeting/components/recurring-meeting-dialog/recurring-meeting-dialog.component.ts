/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { PlatformCommonModule, Translatable } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { FieldType, IAdditionalSelectOptions, IControlContext, UiCommonModule } from '@libs/ui/common';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { IModalOptions, IRecurrence, RECURRENCE_OPTION_TOKEN } from '@libs/basics/interfaces';

export const RecurConstant = { pattern: { daily: 0, weekly: 1, absoluteMonthly: 2, relativeMonthly: 3, absoluteYearly: 4, relativeYearly: 5 }, range: { endDate: 0, numbered: 1 } };

export enum RecurRadio {
	Daily,
	Weekly,
	Monthly,
	Yearly,
}

export enum DailyRadio {
	EveryDay,
	EveryWeekday,
}

export enum MonthlyRadio {
	AbsoluteDay,
	RelativeDay,
}

export enum YearlyRadio {
	AbsoluteDay,
	RelativeDay,
}

enum RangeRadio {
	EndByDate,
	EndByTimes,
}

export enum DurationUnit {
	Minutes = 'basics.meeting.recurrence.minutes',
	Hour = 'basics.meeting.recurrence.hour',
	Hours = 'basics.meeting.recurrence.hours',
	Day = 'basics.meeting.recurrence.day',
	Days = 'basics.meeting.recurrence.days',
	Week = 'basics.meeting.recurrence.week',
	Weeks = 'basics.meeting.recurrence.weeks',
}

/**
 * Recurring meeting form dialog.
 */
@Component({
	selector: 'basics-shared-meeting-recurring-meeting-form-dialog',
	templateUrl: './recurring-meeting-dialog.component.html',
	styleUrls: ['./recurring-meeting-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule, NgForOf, NgIf, DatePipe, NgStyle],
	standalone: true,
})
export class RecurringMeetingDialogComponent {
	private readonly parentOption = inject(RECURRENCE_OPTION_TOKEN);

	protected readonly FieldType = FieldType;

	private controlContextTemplate: IControlContext = { fieldId: '', readonly: false, validationResults: [], entityContext: { totalCount: 0 }, value: '' };

	public recurrence: IRecurrence = {
		pattern: { type: -1, interval: 1, index: 0, month: 0, firstDayOfWeek: 0, daysOfWeek: [], dayOfMonth: 0 },
		range: { type: -1, startDate: new Date(), endDate: this.parentOption.endDate, numberOfOccurrences: 0 },
	};

	private weekOption: { id: number; state: IControlContext; value: Translatable }[] = [
		{ id: 0, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.sunday' },
		{ id: 1, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.monday' },
		{ id: 2, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.tuesday' },
		{ id: 3, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.wednesday' },
		{ id: 4, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.thursday' },
		{ id: 5, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.friday' },
		{ id: 6, state: { ...this.controlContextTemplate, value: false }, value: 'basics.meeting.recurrence.saturday' },
	];

	private durationOption: string[] = [
		`0 ${DurationUnit.Minutes}`,
		`15 ${DurationUnit.Minutes}`,
		`30 ${DurationUnit.Minutes}`,
		`1 ${DurationUnit.Hour}`,
		`2 ${DurationUnit.Hours}`,
		`3 ${DurationUnit.Hours}`,
		`1 ${DurationUnit.Day}`,
		`2 ${DurationUnit.Days}`,
		`1 ${DurationUnit.Week}`,
		`2 ${DurationUnit.Weeks}`,
	];

	private frequencyOption: { id: number; value: Translatable }[] = [
		{ id: 0, value: 'basics.meeting.recurrence.first' },
		{ id: 1, value: 'basics.meeting.recurrence.second' },
		{ id: 2, value: 'basics.meeting.recurrence.third' },
		{ id: 3, value: 'basics.meeting.recurrence.fourth' },
		{ id: 4, value: 'basics.meeting.recurrence.last' },
	];

	private monthOption: { id: number; value: Translatable }[] = [
		{ id: 0, value: 'basics.meeting.recurrence.january' },
		{ id: 1, value: 'basics.meeting.recurrence.february' },
		{ id: 2, value: 'basics.meeting.recurrence.march' },
		{ id: 3, value: 'basics.meeting.recurrence.april' },
		{ id: 4, value: 'basics.meeting.recurrence.may' },
		{ id: 5, value: 'basics.meeting.recurrence.june' },
		{ id: 6, value: 'basics.meeting.recurrence.july' },
		{ id: 7, value: 'basics.meeting.recurrence.august' },
		{ id: 8, value: 'basics.meeting.recurrence.september' },
		{ id: 9, value: 'basics.meeting.recurrence.october' },
		{ id: 10, value: 'basics.meeting.recurrence.november' },
		{ id: 11, value: 'basics.meeting.recurrence.december' },
	];

	private recurrencePatternRadioGroupOpt: IAdditionalSelectOptions = {
		itemsSource: {
			items: [
				{ id: RecurRadio.Daily, displayName: 'basics.meeting.recurrence.daily', iconCSS: 'spaceToUp' },
				{ id: RecurRadio.Weekly, displayName: 'basics.meeting.recurrence.weekly', iconCSS: 'spaceToUp' },
				{ id: RecurRadio.Monthly, displayName: 'basics.meeting.recurrence.monthly', iconCSS: 'spaceToUp' },
				{ id: RecurRadio.Yearly, displayName: 'basics.meeting.recurrence.yearly', iconCSS: 'spaceToUp' },
			],
		},
	};

	private date = new Date();

	public modalOptions: IModalOptions = {
		showAppointmentTime: true,
		showRecurrencePattern: true,
		showRecurrenceRange: true,
		startTime: this.date,
		endTime: this.date,
		duration: '',
		recordStartTime: this.date, // TODO: This variable seems to have no work and will be removed in the future.
		recordEndTime: this.date, // TODO: This variable seems to have no work and will be removed in the future.
		recurrencePatternType: { ...this.controlContextTemplate, value: RecurRadio.Daily },
		isWatch: true,
		recurrencePattern: {
			interval: '1',
			dailyRadio: DailyRadio.EveryDay,
			monthlyRadio: MonthlyRadio.AbsoluteDay /* 0. absoluteMonthly   1. relativeMonthly */,
			yearlyRadio: YearlyRadio.AbsoluteDay /* 0. absoluteYearly   1. relativeYearly */,
			isEveryWeekday: false,
			daysOfWeek: [],
			firstDayOfWeek: null,
			day: this.date.getDay().toString(),
			dayOfMonth: this.date.getDate().toString(),
			index: '0',
			month1: this.date.getMonth().toString(),
			month2: this.date.getMonth().toString(),
		},
		recurrenceRange: {
			startDate: { ...this.controlContextTemplate, value: new Date() },
			endDate: { ...this.controlContextTemplate, value: new Date() },
			numberOfOccurrences: '1',
			type: RangeRadio.EndByDate /* 0.endDate   1.numbered */,
		},

		weekOption: this.weekOption,
		durationOption: this.durationOption,
		frequencyOption: this.frequencyOption,
		monthOption: this.monthOption,
		recurrencePatternRadioGroupOpt: this.recurrencePatternRadioGroupOpt,
	};

	protected readonly RecurRadio = RecurRadio;

	protected readonly DailyRadio = DailyRadio;

	protected readonly MonthlyRadio = MonthlyRadio;

	protected readonly YearlyRadio = YearlyRadio;

	protected readonly RangeRadio = RangeRadio;

	public constructor() {
		const parentStartDate = (this.parentOption.startDate as Date) ?? new Date();
		const parentEndDate = (this.parentOption.endDate as Date) ?? new Date();

		if (this.parentOption.recurrence) {
			this.showCreatedRecurrence();
		} else {
			const startDate = new Date(parentStartDate);
			const endDate = new Date(parentStartDate);
			if (this.parentOption.isAllDay === true) {
				startDate.setHours(0, 0, 0, 0);
				endDate.setDate(endDate.getDate() + 1);
				endDate.setHours(0, 0, 0, 0);

				this.modalOptions.duration = `1 ${DurationUnit.Day}`;
			} else {
				startDate.setHours(this.parentOption.startTime.getHours(), this.parentOption.startTime.getMinutes(), 0, 0);
				endDate.setHours(this.parentOption.endTime.getHours(), this.parentOption.endTime.getMinutes(), 0, 0);

				this.modalOptions.startTime = startDate;
				this.modalOptions.endTime = endDate;
				this.processDuration();
			}
			this.modalOptions.startTime = startDate;
			this.modalOptions.endTime = endDate;
			// this.modalOptions.recordStartTime = this.modalOptions.startTime;
			// this.modalOptions.recordEndTime = this.modalOptions.endTime;

			this.modalOptions.weekOption[this.date.getDay()].state.value = true;

			this.modalOptions.recurrenceRange.startDate.value = new Date(parentStartDate);
			const end = new Date(parentEndDate);
			end.setMonth(end.getMonth() + 3);
			this.modalOptions.recurrenceRange.endDate.value = end;
		}

		this.parentOption.modalOptions = this.modalOptions;
		this.parentOption.recurrence = this.recurrence;
	}

	private initRecurrencePatternData() {
		this.modalOptions.recurrencePattern.dailyRadio = DailyRadio.EveryDay;
		this.modalOptions.recurrencePattern.monthlyRadio = MonthlyRadio.AbsoluteDay;
		this.modalOptions.recurrencePattern.yearlyRadio = YearlyRadio.AbsoluteDay;
		this.modalOptions.recurrencePattern.interval = '1';
		this.modalOptions.recurrencePattern.index = '0';
		this.modalOptions.recurrencePattern.day = this.date.getDay().toString();
		this.modalOptions.weekOption.forEach((day) => (day.state.value = false));
		this.modalOptions.weekOption[this.date.getDay()].state.value = true;
		this.modalOptions.recurrencePattern.dayOfMonth = this.date.getDate().toString();
		this.modalOptions.recurrencePattern.month1 = this.date.getMonth().toString();
		this.modalOptions.recurrencePattern.month2 = this.date.getMonth().toString();
	}

	public updateRadio() {
		this.initRecurrencePatternData();
		const radioValue = this.modalOptions.recurrencePatternType.value as string;
		this.processEndDate(parseInt(radioValue));
	}

	public setDefaultInterval() {
		if (this.modalOptions.recurrencePattern.interval === '') {
			this.modalOptions.recurrencePattern.interval = '1';
		}
	}

	public setDefaultDayOfMonth() {
		if (this.modalOptions.recurrencePattern.dayOfMonth === '') {
			this.modalOptions.recurrencePattern.dayOfMonth = this.date.getDate().toString();
		}
	}

	public setDefaultNumberOfOccurrences() {
		if (this.modalOptions.recurrenceRange.numberOfOccurrences === '') {
			this.modalOptions.recurrenceRange.numberOfOccurrences = '1';
		}
	}

	public estimateInterval() {
		if (this.modalOptions.recurrencePattern.interval) {
			this.modalOptions.recurrencePattern.interval = this.modalOptions.recurrencePattern.interval.toString().replace(/\D/g, '');
			if (parseFloat(this.modalOptions.recurrencePattern.interval) <= 0) {
				this.modalOptions.recurrencePattern.interval = '';
			}
		}
	}

	public estimateDayOfMonth() {
		if (this.modalOptions.recurrencePattern.dayOfMonth) {
			this.modalOptions.recurrencePattern.dayOfMonth = this.modalOptions.recurrencePattern.dayOfMonth.toString().replace(/\D/g, '');
			if (parseFloat(this.modalOptions.recurrencePattern.dayOfMonth) <= 0) {
				this.modalOptions.recurrencePattern.dayOfMonth = '';
			}
			if (parseFloat(this.modalOptions.recurrencePattern.dayOfMonth) > 31) {
				this.modalOptions.recurrencePattern.dayOfMonth = '31';
			}
		}
	}

	public estimateNumberOfOccurrences() {
		if (this.modalOptions.recurrenceRange.numberOfOccurrences) {
			this.modalOptions.recurrenceRange.numberOfOccurrences = this.modalOptions.recurrenceRange.numberOfOccurrences.toString().replace(/\D/g, '');
			if (this.modalOptions.recurrenceRange.numberOfOccurrences <= '0') {
				this.modalOptions.recurrenceRange.numberOfOccurrences = '';
			}
		}
	}

	private showCreatedRecurrence() {
		if (!this.parentOption.recurrence) {
			throw Error('Recurrence is null!'); // TODO: The type inference of 'this.parentOption.recurrence' hint may be null.
		}
		this.modalOptions.startTime = this.parentOption.startTime;
		this.modalOptions.endTime = this.parentOption.endTime;

		this.processDuration();

		if (this.parentOption.recurrence.pattern.daysOfWeek.length === 0) {
			this.modalOptions.weekOption[this.date.getUTCDay()].state.value = true;
		}

		switch (this.parentOption.recurrence.pattern.type) {
			case RecurConstant.pattern.daily:
				this.modalOptions.recurrencePatternType.value = RecurRadio.Daily;
				break;
			case RecurConstant.pattern.weekly:
				if (this.parentOption.isEveryWeekday) {
					this.modalOptions.recurrencePatternType.value = RecurRadio.Daily;
					this.modalOptions.recurrencePattern.dailyRadio = DailyRadio.EveryWeekday;
				} else {
					this.modalOptions.recurrencePatternType.value = RecurRadio.Weekly;
					for (const weekItem of this.modalOptions.weekOption) {
						if (this.parentOption.recurrence.pattern.daysOfWeek.includes(weekItem.id)) {
							weekItem.state.value = true;
						}
					}
				}
				break;
			case RecurConstant.pattern.absoluteMonthly:
				this.modalOptions.recurrencePatternType.value = RecurRadio.Monthly;
				this.modalOptions.recurrencePattern.monthlyRadio = MonthlyRadio.AbsoluteDay;
				break;
			case RecurConstant.pattern.relativeMonthly:
				this.modalOptions.recurrencePatternType.value = RecurRadio.Monthly;
				this.modalOptions.recurrencePattern.monthlyRadio = MonthlyRadio.RelativeDay;
				for (const index of this.modalOptions.frequencyOption) {
					if (index.id === this.parentOption.recurrence.pattern.index) {
						this.modalOptions.recurrencePattern.index = index.id.toString();
					}
				}
				for (const weekItem of this.modalOptions.weekOption) {
					if (weekItem.id === this.parentOption.recurrence.pattern.daysOfWeek[0]) {
						this.modalOptions.recurrencePattern.day = weekItem.id.toString();
					}
				}
				break;
			case RecurConstant.pattern.absoluteYearly:
				this.modalOptions.recurrencePatternType.value = RecurRadio.Yearly;
				this.modalOptions.recurrencePattern.yearlyRadio = YearlyRadio.AbsoluteDay;
				this.modalOptions.recurrencePattern.month1 = (this.parentOption.recurrence.pattern.month - 1).toString();
				break;
			case RecurConstant.pattern.relativeYearly:
				this.modalOptions.recurrencePatternType.value = RecurRadio.Yearly;
				this.modalOptions.recurrencePattern.yearlyRadio = YearlyRadio.RelativeDay;
				for (const index of this.modalOptions.frequencyOption) {
					if (index.id === this.parentOption.recurrence.pattern.index) {
						this.modalOptions.recurrencePattern.index = index.id.toString();
					}
				}
				for (const weekItem of this.modalOptions.weekOption) {
					if (weekItem.id === this.parentOption.recurrence.pattern.daysOfWeek[0]) {
						this.modalOptions.recurrencePattern.day = weekItem.id.toString();
					}
				}
				this.modalOptions.recurrencePattern.month2 = (this.parentOption.recurrence.pattern.month - 1).toString();
				break;
			default:
				break;
		}

		this.modalOptions.recurrencePattern.interval = this.parentOption.recurrence.pattern.interval.toString();
		this.modalOptions.recurrencePattern.dayOfMonth = this.parentOption.recurrence.pattern.dayOfMonth === 0 ? this.date.getDate().toString() : this.parentOption.recurrence.pattern.dayOfMonth.toString();

		this.modalOptions.recurrenceRange.startDate.value = this.parentOption.recurrence.range.startDate === null ? new Date() : this.parentOption.recurrence.range.startDate;

		const end = new Date(this.modalOptions.recurrenceRange.startDate.value);
		end.setMonth(end.getMonth() + 3);
		this.modalOptions.recurrenceRange.endDate.value = end;
		switch (this.parentOption.recurrence.range.type) {
			case RecurConstant.range.endDate:
				this.modalOptions.recurrenceRange.type = RangeRadio.EndByDate;
				if (this.parentOption.recurrence.range.endDate !== null) {
					this.modalOptions.recurrenceRange.endDate.value = this.parentOption.recurrence.range.endDate;
				}
				break;
			case RecurConstant.range.numbered:
				this.modalOptions.recurrenceRange.type = RangeRadio.EndByTimes;
				this.modalOptions.recurrenceRange.numberOfOccurrences = String(this.parentOption.recurrence.range.numberOfOccurrences);
				break;
			default:
				break;
		}
	}

	/** If the 'startTime' or 'Duration' is changed, this function should be triggered. */
	public processEndTime() {
		if (this.modalOptions.duration && this.modalOptions.startTime) {
			const [duration, durationUnit] = this.modalOptions.duration.split(' ');
			const startTime = this.modalOptions.startTime;
			const end = new Date(startTime);
			// FIXME: If duration is a float number, parseInt method will result in an incorrect endTime.
			if (durationUnit.includes('minutes')) {
				end.setMinutes(startTime.getMinutes() + parseInt(duration));
				this.modalOptions.endTime = end;
			} else if (durationUnit.includes('hour')) {
				// 'basics.meeting.recurrence.hour' or 'basics.meeting.recurrence.hours'
				end.setHours(startTime.getHours() + parseInt(duration));
				this.modalOptions.endTime = end;
			} else if (durationUnit.includes('day')) {
				// 'basics.meeting.recurrence.day' or 'basics.meeting.recurrence.days'
				end.setDate(startTime.getDate() + parseInt(duration));
				this.modalOptions.endTime = end;
			} else if (durationUnit.includes('week')) {
				// 'basics.meeting.recurrence.week' or 'basics.meeting.recurrence.weeks'
				end.setDate(startTime.getDay() + parseInt(duration) * 7);
				this.modalOptions.endTime = end;
			}
		}
	}

	/** If the 'startTime' or 'endTime' is changed, this function should be triggered. */
	private processDuration() {
		if (this.modalOptions.startTime && this.modalOptions.endTime) {
			let timeDiff: number = (this.modalOptions.endTime.getTime() - this.modalOptions.startTime.getTime()) / 1000 / 60; // minutes

			let timeH: number = timeDiff / 60; // hour
			timeH = timeH - Math.floor(timeH) === 0 ? Math.floor(timeH) : parseFloat(timeH.toFixed(1)); // FIXME: If 0.96 <= timeH <= 1, 'timeH.toFixed' returns 1.
			timeDiff = timeDiff - Math.floor(timeDiff) === 0 ? Math.floor(timeDiff) : parseFloat(timeDiff.toFixed(1));

			const option = timeH < 1 ? `${timeDiff} ${DurationUnit.Minutes}` : `${timeH} ${timeH === 1 ? DurationUnit.Hour : DurationUnit.Hours}`;

			if (this.modalOptions.durationOption.includes(option)) {
				const index = this.modalOptions.durationOption.indexOf(option);
				this.modalOptions.duration = this.modalOptions.durationOption[index];
			} else {
				this.modalOptions.durationOption.push(option);
				this.modalOptions.duration = option;
			}
		}
	}

	/** Update time values, when the user updates the 'startTime' or 'endTime' on the UI. */
	public updateTime($event: Event, mode: number) {
		const value = (<HTMLInputElement>$event.target).value;
		const [hours, minutes] = value.split(':').map(Number);
		if (mode === 1) {
			this.modalOptions.startTime.setHours(hours, minutes, 0, 0);
			this.processEndTime();
		} else {
			this.modalOptions.endTime.setHours(hours, minutes, 0, 0);
			this.processDuration();
		}
	}

	/** When the recurrence pattern changes, set the default value for endDate of 'Range of recurrence'.
	 * @radioValue: indicates the recurrence pattern.
	 */
	public processEndDate(radioValue: number) {
		const parentEndDate = this.parentOption.endDate;
		const endDate = parentEndDate !== null ? new Date(parentEndDate) : new Date();
		switch (radioValue) {
			case 1:
				endDate.setMonth(endDate.getMonth() + 3);
				this.modalOptions.recurrenceRange.endDate.value = endDate;
				break;
			case 2:
				endDate.setMonth(endDate.getMonth() + 6);
				this.modalOptions.recurrenceRange.endDate.value = endDate;
				break;
			case 3:
				endDate.setFullYear(endDate.getFullYear() + 1);
				this.modalOptions.recurrenceRange.endDate.value = endDate;
				break;
			case 4:
				endDate.setFullYear(endDate.getFullYear() + 9);
				this.modalOptions.recurrenceRange.endDate.value = endDate;
				break;
			default:
				break;
		}
	}

	// TODO: This function does not take effect in angularJS frontend.
	public hideOption(durationOption: string) {
		if (durationOption.length > 0) {
			const [duration, durationUnit] = durationOption.split(' ');
			if (durationUnit.includes('hours')) {
				if (parseInt(duration) > 3 || duration.includes('.')) {
					return { display: 'none' };
				}
			}
			if (parseInt(duration) < 0) {
				return { display: 'none' };
			}
		}
		return {};
	}
}
