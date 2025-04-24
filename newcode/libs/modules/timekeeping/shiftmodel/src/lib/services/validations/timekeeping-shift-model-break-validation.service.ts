import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { addDays, isBefore, isAfter, differenceInHours, parseISO, isValid as isDateValid } from 'date-fns';
import { TimekeepingShiftModelBreakDataService } from '../timekeeping-shift-model-break-data.service';
import { IShiftBreakEntity } from '../../model/entities/shift-break-entity.interface';
import { TimekeepingShiftModelWorkingTimeDataService } from '../timekeeping-shift-model-working-time-data.service';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingShiftModelBreakValidationService extends BaseValidationService<IShiftBreakEntity> {
	private parentDataService = inject(TimekeepingShiftModelWorkingTimeDataService);
	private dataService = inject(TimekeepingShiftModelBreakDataService);

	protected generateValidationFunctions(): IValidationFunctions<IShiftBreakEntity> {
		return {
			BreakStart: [this.validateBreakStart],
			BreakEnd: [this.validateBreakEnd],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IShiftBreakEntity> {
		return this.dataService;
	}

	private validateBreakStart(info: ValidationInfo<IShiftBreakEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as string;

		const breakStart = this.parseDate(value);
		const breakEnd = this.parseDate(entity.BreakEnd);

		if (breakStart && breakEnd) {
			let hours = differenceInHours(breakEnd, breakStart);
			hours = hours < 0 ? 0 : hours;

			entity.Duration = hours;
			entity.BreakStart = breakStart.toISOString(); // Convert back to string
			this.updateDuration(entity);
		}

		return new ValidationResult();
	}

	private validateBreakEnd(info: ValidationInfo<IShiftBreakEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as string;

		const breakStart = this.parseDate(entity.BreakStart);
		const breakEnd = this.parseDate(value);

		if (breakStart && breakEnd) {
			let hours = differenceInHours(breakEnd, breakStart);
			hours = hours < 0 ? 0 : hours;

			entity.Duration = hours;
			entity.BreakEnd = breakEnd.toISOString(); // Convert back to string
			this.updateDuration(entity);
		}

		return new ValidationResult();
	}

	private updateDuration(entity: IShiftBreakEntity): void {
		const workingTime = this.parentDataService.getSelectedEntity();
		const breakData = this.dataService.getList();

		if (workingTime && breakData.length > 0) {
			workingTime.IsBreaksAvailable = true;

			if (breakData.length === 1) {
				workingTime.IsOnlyOneBreak = true;
				workingTime.BreakFrom = this.parseDate(entity.BreakStart)?.toISOString() || null;
				workingTime.BreakTo = this.parseDate(entity.BreakEnd)?.toISOString() || null;
			} else {
				workingTime.IsOnlyOneBreak = false;
				workingTime.BreakFrom = null;
				workingTime.BreakTo = null;
			}

			const startTime = this.parseDate(workingTime.FromTime);
			const endTime = this.parseDate(workingTime.ToTime);

			if (startTime && endTime) {
				const hours = this.calculateWorkingDuration(startTime, endTime, breakData, entity);
				workingTime.Duration = hours;
			}

			this.parentDataService.setModified(workingTime);
		}
	}

	private calculateWorkingDuration(
		startTime: Date,
		endTime: Date,
		breaks: IShiftBreakEntity[],
		entity: IShiftBreakEntity
	): number {
		const adjustedEndTime = isBefore(endTime, startTime) ? addDays(endTime, 1) : endTime;

		const validBreaks = breaks
			.filter((b) => this.parseDate(b.BreakStart) && this.parseDate(b.BreakEnd))
			.map((b) => ({
				start: this.parseDate(b.BreakStart)!,
				end: this.parseDate(b.BreakEnd)!,
				isSameEntity: b.Id === entity.Id,
			}))
			.sort((a, b) => (isAfter(a.start, b.start) ? 1 : -1));

		const totalWorkingHours = differenceInHours(adjustedEndTime, startTime);

		let totalBreakHours = 0;
		let currentStart = startTime;

		validBreaks.forEach(({start: breakStart, end: breakEnd}) => {
			if (isAfter(currentStart, breakEnd)) {
				return;
			}

			const effectiveBreakStart = isBefore(breakStart, currentStart) ? currentStart : breakStart;
			const effectiveBreakEnd = isAfter(breakEnd, adjustedEndTime) ? adjustedEndTime : breakEnd;

			if (isBefore(effectiveBreakStart, effectiveBreakEnd)) {
				totalBreakHours += differenceInHours(effectiveBreakEnd, effectiveBreakStart);
				currentStart = effectiveBreakEnd;
			}
		});

		return totalWorkingHours - totalBreakHours;
	}

	private parseDate(value: string | null | undefined): Date | null {
		if (typeof value === 'string' && isDateValid(parseISO(value))) {
			return parseISO(value);
		}
		return null;
	}
}
