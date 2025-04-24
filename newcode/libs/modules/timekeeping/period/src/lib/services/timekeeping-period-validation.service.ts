import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import _, {} from 'lodash';
import { PlatformTranslateService, PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPeriodEntity } from '../model/entities/period-entity.interface';
import { TimekeepingPeriodDataService } from './timekeeping-period-data.service';
import { isAfter, isBefore, isEqual, parseISO } from 'date-fns';
import { IOverlapsDateEntity } from '../model/entities/overlaps-date-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPeriodValidationService extends BaseValidationService<IPeriodEntity> {

	private readonly http = inject(PlatformHttpService);
	private readonly dataService = inject(TimekeepingPeriodDataService);
	private readonly translate: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private validators: IValidationFunctions<IPeriodEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPeriodEntity>> = PlatformSchemaService<IPeriodEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Period', typeName: 'PeriodDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IPeriodEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPeriodEntity> {
		return {
			TimekeepingGroupFk: [this.asyncValidateTimekeepingGroupFk, this.validateTimekeepingGroupFk],
			StartDate: [this.asyncValidateStartDate, this.validateStartDate],
			EndDate: [this.asyncValidateEndDate, this.validateEndDate]
		};
	}

	private validateTimekeepingGroupFk(info: ValidationInfo<IPeriodEntity>): ValidationResult {
		const result = this.checkOverlap(info);
		if (result.error) {
			return this.validationUtils.createErrorObject(result.error);
		}
		return result;
	}

	private validateStartDate(info: ValidationInfo<IPeriodEntity>): ValidationResult {
		const result = this.checkOverlap(info);
		if (result.error) {
			return this.validationUtils.createErrorObject(result.error);
		}
		return result;
	}

	private validateEndDate(info: ValidationInfo<IPeriodEntity>): ValidationResult {
		const result = this.checkOverlap(info);
		if (result.error) {
			return this.validationUtils.createErrorObject(result.error);
		}
		return result;
	}

	private checkOverlap(info: ValidationInfo<IPeriodEntity>): ValidationResult {
		const result = { apply: true, valid: true, error: '' };
		const entity = info.entity;
		const value = info.value;
		const listPeriods = this.dataService.getList();
		let isOverlap = false;

		_.forEach(listPeriods, (item) => {
			if (
				typeof item.TimekeepingGroupFk === 'number' &&
				item.TimekeepingGroupFk > 0 &&
				typeof value === 'number' &&
				value > 0 &&
				item.TimekeepingGroupFk === value &&
				item.Id !== entity.Id
			) {
				const itemStartDate = item.StartDate;
				const itemEndDate = item.EndDate;
				const entityStartDate = entity.StartDate;
				const entityEndDate = entity.EndDate;

				if (
					(isBefore(parseISO(<string>itemStartDate), parseISO(<string>entityStartDate)) || isEqual(parseISO(<string>entityStartDate), parseISO(<string>entityStartDate))) &&
					(isAfter(parseISO(<string>itemEndDate), parseISO(<string>entityStartDate)) || isEqual(parseISO(<string>itemEndDate), parseISO(<string>entityStartDate))) ||
					(isBefore(parseISO(<string>itemStartDate), parseISO(<string>entityEndDate)) || isEqual(parseISO(<string>itemStartDate), parseISO(<string>entityEndDate))) &&
					(isAfter(parseISO(<string>itemEndDate), parseISO(<string>entityEndDate)) || isEqual(parseISO(<string>itemEndDate), parseISO(<string>entityEndDate)))
				) {
					isOverlap = true;
				}
			}
		});

		if (isOverlap) {
			result.error = this.translate.instant('timekeeping.period.overlaps').text;
		}
		return result;
	}
	private async asyncValidateTimekeepingGroupFk(info: ValidationInfo<IPeriodEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		if (entity.StartDate && entity.EndDate && value > 0) {

			const data = await this.overlapsDate(value, entity.StartDate, entity.EndDate, entity);
			if (data.startDateOverlap === true) {
				return this.validationUtils.createErrorObject('timekeeping.period.startDateOverlaps');
			}
			if (data.endDateOverlap === true) {
				return this.validationUtils.createErrorObject('timekeeping.period.endDateOverlaps');
			}
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject('timekeeping.period.selectrecord');
		}
	}

	private async asyncValidateStartDate(info: ValidationInfo<IPeriodEntity>): Promise<ValidationResult> {
		const validateResult: ValidationResult = {apply: true, valid: true};
		const entity = info.entity;
		const value = info.value as number;
		if (entity.StartDate && entity.EndDate && value > 0) {

			const data = await this.overlapsDate(value, entity.StartDate, entity.EndDate, entity);

			if (data.startDateOverlap === true) {
				return this.validationUtils.createErrorObject('timekeeping.period.startDateOverlaps');
			}
			if (data.endDateOverlap === false) {
				this.ensureNoRelatedError(this.getEntityRuntimeData(), info, ['TimekeepingGroupFk']);
				return validateResult;
			}
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject('timekeeping.period.selectrecord');
		}
	}

	private async asyncValidateEndDate(info: ValidationInfo<IPeriodEntity>): Promise<ValidationResult> {
		const validateResult: ValidationResult = {apply: true, valid: true};
		const periodEntity = info.entity;
		const value = info.value as number;
		if (periodEntity.StartDate && periodEntity.EndDate && value > 0) {
			const data = await this.overlapsDate(value, periodEntity.StartDate, periodEntity.EndDate, periodEntity);

			if (data.endDateOverlap === true) {
				return this.validationUtils.createErrorObject('timekeeping.period.startDateOverlaps');
			}
			if (data.startDateOverlap === false) {
				this.ensureNoRelatedError(this.getEntityRuntimeData(), info, ['TimekeepingGroupFk']);
				return validateResult;
			}
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject('timekeeping.period.selectrecord');
		}
	}

	public overlapsDate(groupFk: number, startDate: Date|string, endDate: Date|string, entity: IPeriodEntity): Promise<IOverlapsDateEntity> {
		const postData = {
			TimekeepingGroupFk: groupFk,
			StartDate: startDate,
			EndDate: endDate,
			Id: entity.Id
		};
		return this.http.post<IOverlapsDateEntity>('timekeeping/period/checkDateOverlaps', postData);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPeriodEntity> {
		return this.dataService;
	}
}
