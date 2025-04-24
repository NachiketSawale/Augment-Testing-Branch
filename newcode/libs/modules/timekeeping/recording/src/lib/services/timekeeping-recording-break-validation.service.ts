import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IReportEntity, ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingBreakDataService } from './timekeeping-recording-break-data.service';
import { TimekeepingRecordingReportDataService } from './timekeeping-recording-report-data.service';
import { parseISO, differenceInHours, format, parse, setHours, setMinutes, setSeconds,differenceInMinutes,isBefore, isAfter } from 'date-fns';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingBreakValidationService extends BaseValidationService<ITimekeepingBreakEntity> {

	private dataService = inject(TimekeepingRecordingBreakDataService);
	private parentService = inject(TimekeepingRecordingReportDataService);
	private readonly translateService = inject(PlatformTranslateService);
	protected generateValidationFunctions(): IValidationFunctions<ITimekeepingBreakEntity> {
		return {
			FromTimeBreakTime: [this.validateFromTimeBreakTimeAsync],
			ToTimeBreakTime: [this.validateToTimeBreakTimeAsync],
			FromTimeBreakDate: [this.validateFromTimeBreakDateAsync],
			ToTimeBreakDate: [this.validateToTimeBreakDateAsync]
		};
	}

	private async validateFromTimeBreakTimeAsync(info: ValidationInfo<ITimekeepingBreakEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (entity.ToTimeBreakTime && value && entity.FromTimeBreakDate && entity.ToTimeBreakDate) {
			let hours = this.calculateHours(value.toString(), entity.ToTimeBreakTime, entity.FromTimeBreakDate, entity.ToTimeBreakDate);
			if (hours < 0) {
				hours = 0;
			}
			entity.Duration = hours;
			entity.FromTimeBreakTime = value.toString();
			this.updateReportDuration(entity);
		}

		return new ValidationResult();
	}

	private async validateToTimeBreakTimeAsync(info: ValidationInfo<ITimekeepingBreakEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (value && entity.FromTimeBreakTime && entity.FromTimeBreakDate && entity.ToTimeBreakDate) {
			let hours = this.calculateHours(entity.FromTimeBreakTime, value.toString(), entity.FromTimeBreakDate, entity.ToTimeBreakDate);
			if (hours < 0) {
				hours = 0;
			}
			entity.Duration = hours;
			this.updateReportDuration(entity);
		}

		return new ValidationResult();
	}

	private async validateFromTimeBreakDateAsync(info: ValidationInfo<ITimekeepingBreakEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (entity.ToTimeBreakTime && value && entity.FromTimeBreakTime && entity.ToTimeBreakDate) {
			let hours = this.calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, value.toString(), entity.ToTimeBreakDate);
			if (hours < 0) {
				hours = 0;
			}
			entity.Duration = hours;
			this.updateReportDuration(entity);
		}

		return new ValidationResult();
	}

	private async validateToTimeBreakDateAsync(info: ValidationInfo<ITimekeepingBreakEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (entity.ToTimeBreakTime && entity.FromTimeBreakDate && entity.FromTimeBreakTime && value) {
			let hours = this.calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, entity.FromTimeBreakDate, value.toString());
			if (hours < 0) {
				hours = 0;
			}
			entity.Duration = hours;
			this.updateReportDuration(entity);
		}

		return new ValidationResult();
	}

	private calculateHours(fromTime: string, toTime: string, fromDate: string, toDate: string): number {
		const fromDateTime = this.formattedDate(fromDate,fromTime);
		const toDateTime = this.formattedDate(toDate,toTime);
		// Calculate the difference in hours
		const hoursDifference = differenceInHours(toDateTime,fromDateTime);
		return hoursDifference;
	}

	private formattedDate(dateString:string,timeString:string){
		const date = parseISO(dateString);
		// Extract hours, minutes, and seconds from the time string
		const [hours, minutes, seconds] = timeString.split(':').map(Number);
		// Combine date and time
		return setSeconds(setMinutes(setHours(date, hours), minutes), seconds);
	}


	private combineDateAndTime(date: string, time: string): Date {
		return parseISO(`${date}T${time}`);
	}

	private updateReportDuration(entity: ITimekeepingBreakEntity): void {
		const report: IReportEntity = this.parentService.getSelection()[0];
		if (report) {
			let hours = 0;
			const breakData = this.dataService.getList();
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					report.BreakFrom = entity.FromTimeBreakTime;
					report.BreakTo = entity.ToTimeBreakTime;
					report.IsModified = true;
				}
				if (report.FromTimePartTime && report.ToTimePartTime && report.FromTimePartDate && report.ToTimePartDate) {
					hours = this.calculateWorkingDuration(report.FromTimePartTime, report.ToTimePartTime, report.FromTimePartDate, report.ToTimePartDate, breakData);
				}
				report.Duration = hours;
			}
			if (report.FromTimePartTime && report.ToTimePartTime && report.FromTimePartDate && report.ToTimePartDate) {
				let reportDuration = this.calculateReportDuration(report.FromTimePartTime, report.ToTimePartTime, report.FromTimePartDate, report.ToTimePartDate, breakData, entity);
				if (reportDuration < 0) {
					reportDuration = 0;
				}
				report.BreakDuration = reportDuration;
			}
		}
	}

	private calculateWorkingDuration(fromTimePartTime: string,toTimePartTime: string,fromTimePartDate: string,toTimePartDate: string,breaks: ITimekeepingBreakEntity[]): number {
		const fromDateTime = parseISO(`${fromTimePartDate}T${fromTimePartTime}`);
		const toDateTime = parseISO(`${toTimePartDate}T${toTimePartTime}`);

		const totalBreakDurationMinutes = this.calculateTotalDuration(breaks) * 60;

		const totalMinutesWorked = differenceInMinutes(toDateTime, fromDateTime);
		// Subtract break duration
		const netWorkingMinutes = totalMinutesWorked - totalBreakDurationMinutes;
		return netWorkingMinutes / 60; // Convert back to hours
	}

	private calculateReportDuration(starttime: string, endtime: string, fromDateStart: string, toDateEnd: string, breaks: ITimekeepingBreakEntity[], entity: ITimekeepingBreakEntity): number {
		if (!starttime && !endtime && !fromDateStart && !toDateEnd) {
			return this.calculateTotalDuration(breaks);
		}

		const reportFromTimeString = this.ensureTimeFormat(starttime);
		const reportToTimeString = this.ensureTimeFormat(endtime);
		const fromDateString = this.ensureDateFormat(fromDateStart);
		const toDateString = this.ensureDateFormat(toDateEnd);

		const nstartDatetime = this.combineDateAndTime(fromDateString, reportFromTimeString);
		const nendDatetime = this.combineDateAndTime(toDateString, reportToTimeString);

		return this.calculateTotalDurationToTime(breaks, nstartDatetime, nendDatetime);
	}

	public calculateTotalDurationToTime(
		breaks: ITimekeepingBreakEntity[],
		starttime: Date,
		endtime: Date
	): number {
		const startDateTime = new Date(starttime);
		const endDateTime = new Date(endtime);

		const intervals = breaks.map(b => {

			const defaultDate = '1970-01-01T00:00:00Z';
			const fromDate = b.FromTimeBreakDate ? parseISO(b.FromTimeBreakDate) : parseISO(defaultDate);
			const toDate = b.ToTimeBreakDate ? parseISO(b.ToTimeBreakDate) : parseISO(defaultDate);

			// Extract time part from "YYYY-MM-DD HH:mm:ss" format
			const fromTime = b.FromTimeBreakTime ? b.FromTimeBreakTime.split(' ')[1] : '00:00:00';
			const [fromHours, fromMinutes, fromSeconds] = fromTime.split(':').map(Number);
			const fromDateTime = setSeconds(setMinutes(setHours(fromDate, fromHours), fromMinutes), fromSeconds);

			const toTime = b.ToTimeBreakTime ? b.ToTimeBreakTime.split(' ')[1] : '00:00:00';
			const [toHours, toMinutes, toSeconds] = toTime.split(':').map(Number);
			const toDateTime = setSeconds(setMinutes(setHours(toDate, toHours), toMinutes), toSeconds);

			// Adjust break start and end based on input start and end time
			 const start = isBefore(fromDateTime, startDateTime) ? startDateTime : fromDateTime;
			 const end = isAfter(toDateTime, endDateTime) ? endDateTime : toDateTime;

			return { start, end };
		});

		// Sort intervals by start time
		intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

		const mergedIntervals: { start: Date, end: Date }[] = [];
		let current = intervals[0];

		for (let i = 1; i < intervals.length; i++) {
			if (current.end >= intervals[i].start) {
				current.end = new Date(Math.max(current.end.getTime(), intervals[i].end.getTime()));
			} else {
				mergedIntervals.push(current);
				current = intervals[i];
			}
		}
		mergedIntervals.push(current);

		// Calculate total break duration in hours
		const totalDuration = mergedIntervals.reduce((total, interval) => {
			return total + (interval.end.getTime() - interval.start.getTime()) / (1000 * 60 * 60); // Convert ms to hours
		}, 0);

		return totalDuration;
	}

	private calculateTotalDuration(breaks: ITimekeepingBreakEntity[]): number {
		const intervals = breaks
			.filter(b => b.FromTimeBreakTime && b.FromTimeBreakDate && b.ToTimeBreakTime && b.ToTimeBreakDate)
			.map(b => {
				const breakStart = this.convertToDate(b.FromTimeBreakDate);
				const breakEnd = this.convertToDate(b.ToTimeBreakDate);
				const startTime = this.convertToTime(b.FromTimeBreakTime);
				const endTime = this.convertToTime(b.ToTimeBreakTime);

				if (breakStart && breakEnd && startTime && endTime) {
					const startDateTime = parseISO(`${breakStart}T${startTime}`);
					const endDateTime = parseISO(`${breakEnd}T${endTime}`);

					// Ensure valid intervals (ignoring zero-duration breaks)
					if (startDateTime.getTime() !== endDateTime.getTime()) {
						return { start: startDateTime, end: endDateTime };
					}
				}
				return null;
			})
			.filter((interval): interval is { start: Date; end: Date } => interval !== null);

		if (intervals.length === 0) {
			return 0;
		}

		intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

		const mergedIntervals: { start: Date; end: Date }[] = [];
		let current = intervals[0];

		for (let i = 1; i < intervals.length; i++) {
			if (current.end >= intervals[i].start) {
				current.end = new Date(Math.max(current.end.getTime(), intervals[i].end.getTime()));
			} else {
				mergedIntervals.push(current);
				current = intervals[i];
			}
		}
		mergedIntervals.push(current);

		const totalDuration = mergedIntervals.reduce((total, interval) => total + differenceInMinutes(interval.end, interval.start), 0);
		return totalDuration / 60; // Convert minutes to hours
	}


	private convertToDate(dateTime: string | null | undefined): string | null {
		// Return null if the input is null or undefined
		return dateTime ? new Date(dateTime).toISOString().split('T')[0] : null;
	}

	private convertToTime(dateTime: string | null | undefined): string | null {
		// Return null if the input is null or undefined
		return dateTime ? new Date(dateTime).toISOString().split('T')[1] : null;
	}

	private ensureTimeFormat(time: string): string {
		const isDateTime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time);
		const isTimeOnly = /^\d{2}:\d{2}:\d{2}$/.test(time);
		if (isDateTime) {
			const parsedTime = parse(time, 'yyyy-MM-dd HH:mm:ss', new Date());
			return format(parsedTime, 'HH:mm:ss');
		} else if (isTimeOnly) {
			const parsedTime = parse(time, 'HH:mm:ss', new Date());
			return format(parsedTime, 'HH:mm:ss');
		} else {
			throw new Error(this.translateService.instant('timekeeping.recording.invalidTimeFormat').text);
		}
	}

	private ensureDateFormat(date: string): string {
		const parsedDate = parseISO(date);
		return format(parsedDate, 'yyyy-MM-dd');
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimekeepingBreakEntity> {
		return this.dataService;
	}
}
