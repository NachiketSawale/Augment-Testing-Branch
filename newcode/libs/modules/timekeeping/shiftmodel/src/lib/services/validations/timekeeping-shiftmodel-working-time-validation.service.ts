/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IShiftWorkingTimeEntity } from '../../model/entities/shift-working-time-entity.interface';
import { TimekeepingShiftModelWorkingTimeDataService } from '../timekeeping-shift-model-working-time-data.service';
import { addDays,differenceInHours, isAfter, isBefore, isValid } from 'date-fns';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingShiftModelWorkingTimeValidationService extends BaseValidationService<IShiftWorkingTimeEntity> {
	private dataService = inject(TimekeepingShiftModelWorkingTimeDataService);

	protected generateValidationFunctions(): IValidationFunctions<IShiftWorkingTimeEntity> {
		return {
			FromTime: [this.validateFromTime],
			ToTime: [this.validateToTime],
			BreakFrom: [this.validateBreakFrom],
			BreakTo: [this.validateBreakTo],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IShiftWorkingTimeEntity> {
		return this.dataService;
	}

	private validateFromTime(info: ValidationInfo<IShiftWorkingTimeEntity>): ValidationResult {
		const entity =info.entity;
		const value = info.value as Date;

		if (!entity || !this.isDate(value)) {
			return new ValidationResult();
		}

		const toTime = this.getValidDate(entity.ToTime);
		const breakFrom = this.getValidDate(entity.BreakFrom);
		const breakTo = this.getValidDate(entity.BreakTo);

		if (!toTime) {
			return new ValidationResult();
		}

		entity.Duration = this.calculateAdjustedShiftDuration(value, toTime, breakFrom, breakTo);
		return new ValidationResult();
	}

	private validateToTime(info: ValidationInfo<IShiftWorkingTimeEntity>): ValidationResult {
		const entity = info.entity;
		const value =info.value as Date;
		if (!entity || !this.isDate(value)) {
			return new ValidationResult();
		}

		const fromTime = this.getValidDate(entity.FromTime);
		const breakFrom = this.getValidDate(entity.BreakFrom);
		const breakTo = this.getValidDate(entity.BreakTo);

		if (!fromTime) {
			return new ValidationResult();
		}

		entity.Duration = this.calculateAdjustedShiftDuration(fromTime, value, breakFrom, breakTo);
		return new ValidationResult();
	}

	private validateBreakFrom(info: ValidationInfo<IShiftWorkingTimeEntity>): ValidationResult {
		const entity = info.entity;
		const value =info.value as Date;
		if (!entity || !this.isDate(value)) {
			return new ValidationResult();
		}

		const fromTime = this.getValidDate(entity.FromTime);
		const toTime = this.getValidDate(entity.ToTime);
		const breakTo = this.getValidDate(entity.BreakTo);

		if (!fromTime || !toTime) {
			return new ValidationResult();
		}

		entity.Duration = this.calculateAdjustedShiftDuration(fromTime, toTime, value, breakTo);
		return new ValidationResult();
	}

	private validateBreakTo(info: ValidationInfo<IShiftWorkingTimeEntity>): ValidationResult {
		const entity = info.entity;
		const value =info.value as Date;

		if (!entity || !this.isDate(value)) {
			return new ValidationResult();
		}

		const fromTime = this.getValidDate(entity.FromTime);
		const toTime = this.getValidDate(entity.ToTime);
		const breakFrom = this.getValidDate(entity.BreakFrom);

		if (!fromTime || !toTime || !breakFrom) {
			return new ValidationResult();
		}

		entity.Duration = this.calculateAdjustedShiftDuration(fromTime, toTime, breakFrom, value);
		return new ValidationResult();
	}

	private getValidDate(value: Date|string|undefined|null): Date | null {
		return value && isValid(new Date(value)) ? new Date(value) : null;
	}

	private isDate(value: Date|string|undefined|null): value is Date {
		return value instanceof Date && isValid(value);
	}

	private calculateAdjustedShiftDuration(
		fromTime: Date,
		toTime: Date,
		breakFrom: Date | null,
		breakTo: Date | null
	): number {
		if (!this.isDate(fromTime) || !this.isDate(toTime)) {
			throw new Error('Invalid fromTime or toTime provided.');
		}

		const shiftDuration = this.calculateHours(fromTime, toTime);

		if (!breakFrom || !breakTo) {
			return shiftDuration;
		}

		const breakHours = this.calculateHours(breakFrom, breakTo);

		if (this.isBreakWithinShift(fromTime, toTime, breakFrom, breakTo)) {
			return Math.max(0, shiftDuration - breakHours);
		}

		if (this.isShiftWithinBreak(fromTime, toTime, breakFrom, breakTo)) {
			return 0;
		}

		return shiftDuration;
	}

	private calculateHours(fromTime: Date, toTime: Date): number {
		if (!this.isDate(fromTime) || !this.isDate(toTime)) {
			throw new Error('Invalid fromTime or toTime provided. Expected Date objects.');
		}

		if (isAfter(fromTime, toTime)) {
			return differenceInHours(addDays(toTime, 1), fromTime);
		}

		return differenceInHours(toTime, fromTime);
	}

	private isBreakWithinShift(fromTime: Date, toTime: Date, breakFrom: Date, breakTo: Date): boolean {
		return isBefore(breakFrom, toTime) && isAfter(breakTo, fromTime);
	}

	private isShiftWithinBreak(fromTime: Date, toTime: Date, breakFrom: Date, breakTo: Date): boolean {
		return isAfter(fromTime, breakFrom) && isBefore(toTime, breakTo);
	}
}
