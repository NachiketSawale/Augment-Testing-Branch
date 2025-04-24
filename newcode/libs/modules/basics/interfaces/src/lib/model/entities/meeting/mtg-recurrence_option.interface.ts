import { InjectionToken } from '@angular/core';
import { IAdditionalSelectOptions, IControlContext } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';


export const RECURRENCE_OPTION_TOKEN = new InjectionToken<IMtgRecurrenceOption>('RECURRENCE_OPTION_TOKEN');

export const MEETING_HEADER_TOKEN = new InjectionToken<IMeetingItem>('MEETING_HEADER_TOKEN');
export const MEETING_DELETION_TOKEN = new InjectionToken<IMtgDeletionOption>('MEETING_DELETION_TOKEN');

export interface IMtgRecurrenceOption {
	isAllDay: boolean,
	// syncMeetingType: string,
	startDate: Date,
	endDate: Date,
	startTime: Date,
	endTime: Date,
	isEveryWeekday: boolean,

	modalOptions: IModalOptions | null,
	recurrence: IRecurrence | null
}

export interface IRecurrencePattern {
	interval: string, // number string
	dailyRadio: number,  /* 2.every weekday */
	isEveryWeekday: boolean,
	daysOfWeek: number[],
	firstDayOfWeek: null,
	day: string,
	dayOfMonth: string,
	index: string,
	month1: string,
	month2: string,
	monthlyRadio: number,  /* 1. absoluteMonthly   2. relativeMonthly */
	yearlyRadio: number,   /* 1. absoluteYearly   2. relativeYearly */
}

export interface IRecurrenceRange {
	startDate: IControlContext<Date>,
	endDate: IControlContext<Date>,
	numberOfOccurrences: string,
	type: number
}

export interface IModalOptions {
	showAppointmentTime: boolean,
	showRecurrencePattern: boolean,
	showRecurrenceRange: boolean,
	startTime: Date,
	endTime: Date,
	duration: string,
	recordStartTime: Date,
	recordEndTime: Date,
	recurrencePatternType: IControlContext,
	isWatch: boolean,
	recurrencePattern: IRecurrencePattern,
	recurrenceRange: IRecurrenceRange,

	weekOption: { id: number, state: IControlContext, value: Translatable }[],
	durationOption: string[],
	frequencyOption: { id: number, value: Translatable }[],
	monthOption: { id: number, value: Translatable }[],
	recurrencePatternRadioGroupOpt: IAdditionalSelectOptions
}

export interface IRecurrence {
	pattern: { type: number, interval: number, index: number, month: number, firstDayOfWeek: number, daysOfWeek: number[], dayOfMonth: number },
	range: { type: number, startDate: Date, endDate: Date, numberOfOccurrences: number }
}

export interface IMeetingItem {
	Code: string;
	Title?: string | null;
	ProjectFk?: number | null;
	Location?: string | null;

	StartTime?: string | null;
	EndTime: string;

	URL: string;
	TypeFk: number;
	RequiredClerkItems: number[] | number;
	RequiredContactItems: number[] | number ;
	OptionalClerkItems: number[] | number;
	OptionalContactItems: number[] | number;

	IsImportance: boolean;
	ClerkFK: number | null;
	SyncMeetingType: number;
	TimeZone: { TimeZoneIanaId: string, TimeZoneOffSet: number };

	Recurrence?: boolean | null;

	DefectFk?: number | null;
	CheckListFk?: number | null;
	RfqHeaderFk?: number | null;
	QtnHeaderFk?: number | null;
}
export interface IMtgDeletionOption {
	includeRecurrence:boolean
}