/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IReadOnlyField, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IReportEntity, ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportDataService } from './timekeeping-recording-report-data.service';
import { BREAK_DATA } from './timekeeping-recording-break-data.service';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { parse, parseISO, format, differenceInHours, compareAsc } from 'date-fns';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingReportValidationService extends BaseValidationService<IReportEntity> {

	private breakDataService: ITimekeepingBreakEntity[] = [];
	private readonly dataService = inject(TimekeepingRecordingReportDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	public constructor(private injector: Injector) {
		super();
	}

	public initializeBreakData() {
		const breakData = this.injector.get(BREAK_DATA);
		this.breakDataService = breakData;
	}

	public setReadonlyDrivenByProjectActionFk(entity: IReportEntity,value:number) {
		const readOnly = !isNil(value);
		const readonlyFields: IReadOnlyField<IReportEntity>[] = [
			{ field: 'ControllingUnitFk', readOnly: !readOnly },
			{ field: 'ProjectFk', readOnly: !readOnly },
			{ field: 'JobFk', readOnly: !readOnly },
		];
		this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
	}

	public calculateWorkingDuration(
		starttime: string,
		endtime: string,
		fromDateStart: Date,
		toDateEnd: Date,
		newBreaks: ITimekeepingBreakEntity[],
		entity: IReportEntity
	): number {
		const fromDateTime = parse(`${format(fromDateStart, 'yyyy-MM-dd')}T${starttime}`,'yyyy-MM-dd\'T\'HH:mm:ss',new Date());
		const toDateTime = parse(`${format(toDateEnd, 'yyyy-MM-dd')}T${endtime}`,'yyyy-MM-dd\'T\'HH:mm:ss',new Date());

		let startDatetime = fromDateTime;
		const endDatetime = toDateTime;

		const breaks = newBreaks.map(item => {
			if (item.FromTimeBreakTime !== undefined && item.FromTimeBreakTime !== null && item.ToTimeBreakTime !== undefined && item.ToTimeBreakTime !== null && item.FromTimeBreakDate !== undefined && item.FromTimeBreakDate !== null && item.ToTimeBreakDate !== undefined && item.ToTimeBreakDate !== null) {
				const breakStartDatetime = parse(`${format(parseISO(item.FromTimeBreakDate.toString()), 'yyyy-MM-dd')}T${item.FromTimeBreakTime}`,'yyyy-MM-dd\'T\'HH:mm:ss',new Date());
				const breakEndDatetime = parse(`${format(parseISO(item.ToTimeBreakDate.toString()), 'yyyy-MM-dd')}T${item.ToTimeBreakTime}`,'yyyy-MM-dd\'T\'HH:mm:ss',new Date());
				return [breakStartDatetime, breakEndDatetime];
			}
			return [];
		});

		breaks.sort((a, b) => compareAsc(a[0], b[0]));

		const BH = [];
		let TBH = 0;
		const totalWorkingHours = differenceInHours(endDatetime, startDatetime);

		for (const value of breaks) {
			if (!value || !Array.isArray(value) || value.length < 2) {
				console.error(this.translateService.instant('timekeeping.recording.invalidBreakValue').text, value);
				continue;
			}
			let [breakStart, breakEnd] = value;
			if (breakStart <= startDatetime && breakEnd >= endDatetime) {
				breakStart = startDatetime;
				breakEnd = endDatetime;
			}
			if (breakEnd < breakStart) {
				const breakHours = 0;
				BH.push(breakHours);
			} else {
				const breakHours = differenceInHours(breakEnd, breakStart);
				BH.push(breakHours);
				startDatetime = breakEnd;
			}
		}

		for (const hours of BH) {
			TBH += hours;
		}

		const totalBreakHours = TBH;
		const ActualWorkingHours = totalWorkingHours - totalBreakHours;
		entity.BreakDuration = totalBreakHours;
		return ActualWorkingHours;
	}

	public calculateHours(FromTime: Date, ToTime: Date): number {
		return this.hoursDiff(FromTime, ToTime);
	}

	public hoursDiff(dt1: Date, dt2: Date): number {
		const diffTime = Math.abs(dt2.getTime() - dt1.getTime()); // Absolute value to ensure positive difference
		return diffTime / (1000 * 60 * 60); // Convert milliseconds to hours
	}

	public checkIsBreakOutsideShift(FromTime: string, ToTime: string, breakFrom: string, breakTo: string): boolean {
		return FromTime > breakTo || breakFrom > ToTime;
	}

	public checkIsBreakInShift(from: string,to: string,breakFrom: string,breakTo: string): boolean {
		// Convert time strings to Date objects
		const fromTime = new Date(`1970-01-01T${from}:00`);
		const toTime = new Date(`1970-01-01T${to}:00`);
		const breakFromTime = new Date(`1970-01-01T${breakFrom}:00`);
		const breakToTime = new Date(`1970-01-01T${breakTo}:00`);

		// Check if the break is within the shift
		return fromTime <= breakFromTime && toTime > breakFromTime && toTime >= breakToTime;
	}

	public checkIsShiftInBreak(from: string,to: string,breakFrom: string,breakTo: string): boolean {
		// Convert time strings to Date objects (use any base date, here "1970-01-01")
		const fromDate = new Date(`1970-01-01T${from}:00`);
		const toDate = new Date(`1970-01-01T${to}:00`);
		const breakFromDate = new Date(`1970-01-01T${breakFrom}:00`);
		const breakToDate = new Date(`1970-01-01T${breakTo}:00`);

		const fromTime = fromDate.getHours();
		const toTime = toDate.getHours();

		if (fromTime > toTime) {
			const breakInMilliseconds = breakToDate.getTime() - breakFromDate.getTime();
			let breakHours = breakInMilliseconds / (1000 * 60 * 60);

			const shiftInMilliseconds = toDate.getTime() - fromDate.getTime();
			let shiftHours = shiftInMilliseconds / (1000 * 60 * 60);

			if (shiftHours < 0) {
				shiftHours += 24;
			}
			if (breakHours < 0) {
				breakHours += 24;
			}
			return breakHours > shiftHours;
		} else {
			return fromDate >= breakFromDate && toDate <= breakToDate;
		}
	}

	public checkInTimeWithinBreak(from: string, breakFrom: string, breakTo: string): boolean {
		return from >= breakFrom && from < breakTo;
	}

	public checkOutTimeWithinBreak(to: string, breakFrom: string, breakTo: string): boolean {
		return to > breakFrom && to < breakTo;
	}

	public calculateBreakHours(FromTime: string,ToTime: string,FromDate: string|Date,ToDate: string|Date,breakFrom: string,breakTo: string): number {
		if (this.checkIsBreakOutsideShift(FromTime, ToTime, breakFrom, breakTo)) {
			return 0;
		} else {
			// Adjust break start and end times if within the shift
			if (this.checkInTimeWithinBreak(FromTime, breakFrom, breakTo)) {
				breakFrom = FromTime;
			} else if (this.checkOutTimeWithinBreak(ToTime, breakFrom, breakTo)) {
				breakTo = ToTime;
			}

			// Combine dates and times into ISO strings for parsing
			const fromDateTime = parse(`${FromDate} ${breakFrom}`, 'yyyy-MM-dd HH:mm', new Date());
			const toDateTime = parse(`${ToDate} ${breakTo}`, 'yyyy-MM-dd HH:mm', new Date());

			// Calculate the difference in hours between the two datetimes
			return differenceInHours(toDateTime, fromDateTime);
		}
	}

	private combineDateAndTime(date: string | Date, time: string): Date {

		const dateString = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
		const [year, month, day] = dateString.split('-').map(Number);
		const [hours, minutes, seconds = 0] = time.split(':').map(Number);
		return new Date(year, month - 1, day, hours, minutes, seconds);
	}

	private getBreakDataList(id: number): Promise<ITimekeepingBreakEntity[]> {
		const payload = { pKey1: id };
		return this.http.post<ITimekeepingBreakEntity[]>('timekeeping/recording/break/listByParent', payload);
	}

	protected generateValidationFunctions(): IValidationFunctions<IReportEntity> {
		return {
			FromTimePartDate: [this.validateFromTimePartDateAsync],
			ToTimePartDate: [this.validateToTimePartDateAsync],
			FromTimePartTime: [this.validateFromTimePartTimeAsync],
			ToTimePartTime: [this.validateToTimePartTimeAsync],
			BreakFrom: [this.validateBreakFromAsync],
			BreakTo: [this.validateBreakToAsync],
			ProjectActionFk: [this.validateProjectActionFkAsync],
			ProjectFk: [this.validateProjectFkAsync]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IReportEntity> {
		return this.dataService;
	}

	private async validateFromTimePartDateAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (value !== null && value!==undefined && entity.ToTimePartDate !== null && entity.ToTimePartTime !== null && entity.ToTimePartTime!==undefined && entity.FromTimePartTime !== null && entity.FromTimePartTime !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(value.toString());
				const toDate = new Date(entity.ToTimePartDate!);

				entity.Duration = this.calculateWorkingDuration(entity.FromTimePartTime,entity.ToTimePartTime,fromDate,toDate,breakData,entity);
			} else {
				const fromDateTime = this.combineDateAndTime(value.toString(), entity.FromTimePartTime);
				const toDateTime = this.combineDateAndTime(entity.ToTimePartDate!, entity.ToTimePartTime!);

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (entity.BreakFrom !== null && entity.BreakTo !== null) {
					const breakHours = this.calculateBreakHours(entity.FromTimePartTime,entity.ToTimePartTime!,value.toString(),entity.ToTimePartDate!,entity.BreakFrom!,entity.BreakTo!);
					if (this.checkIsBreakInShift(entity.FromTimePartTime, entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkInTimeWithinBreak(entity.FromTimePartTime, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkOutTimeWithinBreak(entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(entity.FromTimePartTime, entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateToTimePartDateAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (entity.FromTimePartDate !== null && entity.FromTimePartDate!==undefined && value !== null && value !== undefined && entity.ToTimePartTime !== null && entity.ToTimePartTime !== undefined && entity.FromTimePartTime !== null && entity.FromTimePartTime !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(entity.FromTimePartDate);
				const toDate = new Date(value.toString());

				entity.Duration = this.calculateWorkingDuration(entity.FromTimePartTime,entity.ToTimePartTime,fromDate,toDate,breakData,entity);
			} else {
				const fromDateTime = this.combineDateAndTime(entity.FromTimePartDate, entity.FromTimePartTime);
				const toDateTime = this.combineDateAndTime(value.toString(), entity.ToTimePartTime!);

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (entity.BreakFrom !== null && entity.BreakTo !== null) {
					const breakHours = this.calculateBreakHours(entity.FromTimePartTime,entity.ToTimePartTime!,entity.FromTimePartDate,value.toString(),entity.BreakFrom!,entity.BreakTo!);
					if (this.checkIsBreakInShift(entity.FromTimePartTime, entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkInTimeWithinBreak(entity.FromTimePartTime, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkOutTimeWithinBreak(entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(entity.FromTimePartTime, entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateFromTimePartTimeAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (entity.FromTimePartDate !== null && entity.ToTimePartDate !== null && entity.ToTimePartTime !== null && entity.ToTimePartTime !== undefined && value !== null && value !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(entity.FromTimePartDate!);
				const toDate = new Date(entity.ToTimePartDate!);

				entity.Duration = this.calculateWorkingDuration(
					value.toString(),
					entity.ToTimePartTime,
					fromDate,
					toDate,
					breakData,
					entity
				);
			} else {
				const fromDateTime = this.combineDateAndTime(entity.FromTimePartDate!, value.toString());
				const toDateTime = this.combineDateAndTime(entity.ToTimePartDate!, entity.ToTimePartTime!);

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (entity.BreakFrom !== null && entity.BreakTo !== null) {
					const breakHours = this.calculateBreakHours(value.toString(),entity.ToTimePartTime!,entity.FromTimePartDate!,entity.ToTimePartDate!,entity.BreakFrom!,entity.BreakTo!);
					if (this.checkIsBreakInShift(value.toString(), entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkInTimeWithinBreak(value.toString(), entity.BreakFrom!, entity.BreakTo!) ||
						this.checkOutTimeWithinBreak(entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(value.toString(), entity.ToTimePartTime!, entity.BreakFrom!, entity.BreakTo!)) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateToTimePartTimeAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (entity.FromTimePartDate !== null && entity.ToTimePartDate !== null && value !== null && value !== undefined && entity.FromTimePartTime !== null && entity.FromTimePartTime !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(entity.FromTimePartDate!);
				const toDate = new Date(entity.ToTimePartDate!);

				entity.Duration = this.calculateWorkingDuration(
					entity.FromTimePartTime,
					value.toString(),
					fromDate,
					toDate,
					breakData,
					entity
				);
			} else {
				const fromDateTime = this.combineDateAndTime(entity.FromTimePartDate!, entity.FromTimePartTime);
				const toDateTime = this.combineDateAndTime(entity.ToTimePartDate!, value.toString());

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (entity.BreakFrom !== null && entity.BreakTo !== null) {
					const breakHours = this.calculateBreakHours(entity.FromTimePartTime,value.toString(),entity.FromTimePartDate!,entity.ToTimePartDate!,entity.BreakFrom!,entity.BreakTo!);
					if (this.checkIsBreakInShift(entity.FromTimePartTime, value.toString(), entity.BreakFrom!, entity.BreakTo!) ||
						this.checkInTimeWithinBreak(entity.FromTimePartTime, entity.BreakFrom!, entity.BreakTo!) ||
						this.checkOutTimeWithinBreak(value.toString(), entity.BreakFrom!, entity.BreakTo!)) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(entity.FromTimePartTime, value.toString(), entity.BreakFrom!, entity.BreakTo!)) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateBreakFromAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (value!==null && value!==undefined && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null && entity.ToTimePartTime !== null && entity.ToTimePartTime !== undefined && entity.FromTimePartTime !== null && entity.FromTimePartTime !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(entity.FromTimePartDate!);
				const toDate = new Date(entity.ToTimePartDate!);

				entity.Duration = this.calculateWorkingDuration(
					entity.FromTimePartTime,
					entity.ToTimePartTime,
					fromDate,
					toDate,
					breakData,
					entity
				);
			} else {
				const fromDateTime = this.combineDateAndTime(entity.FromTimePartDate!, entity.FromTimePartTime);
				const toDateTime = this.combineDateAndTime(entity.ToTimePartDate!, entity.ToTimePartTime);

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (value !== null && value !== undefined && entity.BreakTo !== null) {
					const breakHours = this.calculateBreakHours(entity.FromTimePartTime,entity.ToTimePartTime,entity.FromTimePartDate!,entity.ToTimePartDate!,value.toString(),entity.BreakTo!);
					if (this.checkIsBreakInShift(entity.FromTimePartTime, entity.ToTimePartTime, value.toString(), entity.BreakTo!) ||
						this.checkInTimeWithinBreak(entity.FromTimePartTime, value.toString(), entity.BreakTo!) ||
						this.checkOutTimeWithinBreak(entity.ToTimePartTime, value.toString(), entity.BreakTo!)) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(entity.FromTimePartTime, entity.ToTimePartTime, value.toString(), entity.BreakTo!)) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateBreakToAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const { entity, value } = info;

		if (entity.BreakFrom!==null && entity.BreakFrom!==undefined && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null && entity.ToTimePartTime !== null && entity.ToTimePartTime !== undefined && entity.FromTimePartTime !== null && entity.FromTimePartTime !== undefined) {
			const breakData = await this.getBreakDataList(entity.Id);
			if (breakData.length > 0) {
				if (breakData.length === 1) {
					entity.BreakFrom = breakData[0].FromTimeBreakTime;
					entity.BreakTo = breakData[0].ToTimeBreakTime;
				}

				const fromDate = new Date(entity.FromTimePartDate!);
				const toDate = new Date(entity.ToTimePartDate!);

				entity.Duration = this.calculateWorkingDuration(
					entity.FromTimePartTime,
					entity.ToTimePartTime,
					fromDate,
					toDate,
					breakData,
					entity
				);
			} else {
				const fromDateTime = this.combineDateAndTime(entity.FromTimePartDate!, entity.FromTimePartTime);
				const toDateTime = this.combineDateAndTime(entity.ToTimePartDate!, entity.ToTimePartTime);

				let hours = this.calculateHours(fromDateTime, toDateTime);

				if (value !== null && value !== undefined && entity.BreakFrom !== null) {
					const breakHours = this.calculateBreakHours(entity.FromTimePartTime,entity.ToTimePartTime,entity.FromTimePartDate!,entity.ToTimePartDate!,entity.BreakFrom!,value.toString());
					if (this.checkIsBreakInShift(entity.FromTimePartTime, entity.ToTimePartTime, entity.BreakFrom!, value.toString()) ||
						this.checkInTimeWithinBreak(entity.FromTimePartTime, entity.BreakFrom!, value.toString()) ||
						this.checkOutTimeWithinBreak(entity.ToTimePartTime, entity.BreakFrom!, value.toString())) {
						hours -= breakHours;
					}

					if (this.checkIsShiftInBreak(entity.FromTimePartTime, entity.ToTimePartTime, entity.BreakFrom!, value.toString())) {
						hours = 0;
					}
				}

				hours = Math.max(0, Math.min(hours, 24));
				entity.Duration = hours;
			}
		} else {
			entity.From = null;
		}

		return new ValidationResult();
	}

	private async validateProjectActionFkAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		// Initialize the validation result
		const result = {valid: true, apply: true} as ValidationResult;
		const value = info.value as number;
		// Check if the entity and ProjectFk are defined
		if (value) {
			// Define the URL for the API endpoint
			const url = 'project/main/action/getbyid';

			// Create the body payload for the POST request
			const body = {Id: value};

			// Perform the POST request to fetch sales data
			const response = await lastValueFrom(this.http.post$(url, body));

			// Check if the response contains data
			if (response) {
				// Assign the values
				// info.entity.ControllingUnitFk = response.data.ControllingUnitFk;
				// info.entity.ProjectFk = response.data.ProjectFk;
				// info.entity.JobFk = response.data.LogisticJobFk;
				// this.setReadonlyDrivenByProjectActionFk(info.entity);
			}
		} else {
			// Assign the default currency foreign key if no ProjectFk is defined
			info.entity.ProjectFk = null;

			this.setReadonlyDrivenByProjectActionFk(info.entity,value);
		}

		// Return the validation result
		return result;
	}

	private async validateProjectFkAsync(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		if (info.entity.ProjectFk !== info.value || info.value === null) {
			info.entity.JobFk = null;
		}
		const result = new ValidationResult();
		return result;
	}

	private async validateTimeSymbolFk(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		// Initialize the validation result
		const result = {valid: true, apply: true} as ValidationResult;

		if (info.value) {
			const url = 'timekeeping/timesymbols/getTimeSymbolGroup?timesymbolid=' + info.value;
			const response = await lastValueFrom(this.http.get$(url));
			if (response) {
				// if (response.data) {
				// 	info.entity.TimeSymbolGroupFk = response.data[0];
				// }
			}
		}
		return result;
	}

}