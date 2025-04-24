/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IActivityEntity, IActivityRelationshipEntity, ICalculationActivityEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { ActivityComplete } from '../../model/activity-complete.class';
import { SchedulingMainDueDateService } from '../scheduling-main-due-date.service';

@Injectable({
	providedIn: 'root'
})


export class ActivityValidationService extends BaseValidationService<IActivityEntity> {

	protected translateService = inject(PlatformTranslateService);
	private dataService = inject(SchedulingMainDataService);
	private dueDateService = inject(SchedulingMainDueDateService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly constraintTypes = {
		AsLateAsPossible: 1,
		AsSoonAsPossible: 2,
		FinishNoEarlierThan: 3,
		FinishNoLaterThan: 4,
		MustFinishOn: 5,
		MustStartOn: 6,
		StartNoEarlierThan: 7,
		StartNoLaterThan: 8,
		NoConstraint: 9
	};

	public getEffectedActivities(parameter: ICalculationActivityEntity, entity: IActivityEntity) {
		return [entity];
	}

	protected generateValidationFunctions(): IValidationFunctions<IActivityEntity> {
		return {
			Code: [this.asyncValidateCode],
			PlannedDuration: [this.asyncValidatePlannedDuration],
			Quantity: [this.asyncValidateQuantity],
			PerformanceFactor: [this.asyncValidatePerformanceFactor],
			ResourceFactor: [this.asyncValidateResourceFactor],
			QuantityUoMFk: [this.asyncValidateQuantityUoMFk],
			IsQuantityEvaluated: [this.asyncValidateIsQuantityEvaluated],
			Perf1UoMFk: [this.asyncValidatePerf1UoMFk],
			Perf2UoMFk: [this.asyncValidatePerf2UoMFk],
			ActivityTemplateFk: [this.asyncValidateActivityTemplateFk],
			ConstraintTypeFk: [this.validateConstraintTypeFk, this.asyncValidateConstraintTypeFk],
			LocationFk: [this.asyncValidateLocationFk],
			CalendarFk: [this.asyncValidateCalendarFk],
			ExecutionFinished: [this.asyncValidateExecutionFinished],
			ActualStart: [this.validateActualStart,this.asyncValidateActualStart],
			ConstraintDate: [this.validateConstraintDate, this.asyncValidateConstraintDate],
			PlannedStart: [this.validatePlannedStart,this.asyncValidatePlannedStart],
			PlannedFinish: [this.validatePlannedFinish,this.asyncValidatePlannedFinish],
			ActualFinish: [this.validateActualFinish,this.asyncValidateActualFinish],
			ExecutionStarted: [this.validateExecutionStarted,this.asyncValidateExecutionStarted],
			ScheduleSubFk: [this.asyncValidateScheduleSubFk],
			ActivitySubFk: [this.asyncValidateActivitySubFk],
			DueDateQuantityPerformance: [this.asyncValidateDueDateQuantityPerformance],
			Predecessor: [this.validatePredecessor],
			Successor: [this.validateSuccessor],
			PercentageCompletion: [this.asyncValidatePercentageCompletion],
			RemainingActivityQuantity: [this.asyncValidateRemainingActivityQuantity],
			PeriodQuantityPerformance: [this.asyncValidatePeriodQuantityPerformance],
			DueDateWorkPerformance: [this.asyncValidateDueDateWorkPerformance],
			RemainingActivityWork: [this.asyncValidateRemainingActivityWork],
			PeriodWorkPerformance: [this.asyncValidatePeriodWorkPerformance],
			IsDurationEstimationDriven: [this.validateIsDurationEstimationDriven],
		};
	}

	private createErrorMessage(header: string, body: string): IMessageBoxOptions {
		return {
			headerText: header,
			bodyText: body,
			buttons: [{ id: StandardDialogButtonId.Ok }],
			iconClass: 'ico-error'
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActivityEntity> {
		return this.dataService;
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IActivityEntity>): IActivityEntity[] => {
		const itemList = this.dataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
		return res;
	};

	private asyncValidateCode(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {

		return new Promise((resolve) => {
			const entity = info.entity;
			const value = info.value;
			const postData = {
				id: entity.Id,
				code: value,
				scheduleFk: entity.ScheduleFk
			};
			let result = this.validateIsMandatory(info);
			if (!result.valid) {
				resolve(result);
			} else {
				result = this.validateIsUnique(info);
				if (!result.valid) {
					resolve(result);
				} else {
					this.http.post<boolean>('scheduling/main/activity/isunique', postData)
						.then((response: boolean) => {
							const isUnique = response;
							if (isUnique) {
								entity.Code = info.value as string;
								resolve({apply: true, valid: true});
							} else {
								resolve({
									apply: false,
									valid: false,
									error: this.translateService.instant('scheduling.main.uniqCode').text
								});
							}
						});
				}
			}
		});
	}

	private asyncValidatePlannedDuration(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			const entity = info.entity;
			const value = info.value;
			const durationValue = value;
			let duration: number | undefined = undefined;
			if (typeof durationValue === 'number') {
				duration = durationValue;
			} else {
				duration = undefined;  // or handle as needed
			}
			const parameter:ICalculationActivityEntity= {
				Id: entity.Id,
				Duration: duration
			};
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		});

	}

	private async asyncValidateQuantity(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const quantityValue = value;
		let quantity: number | undefined = undefined;
		if (typeof quantityValue === 'number') {
			quantity = quantityValue;
		} else {
			quantity = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			Quantity: quantity
		};

		if (entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.PerformanceFactor || entity.HasReports) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});

		}
		return new ValidationResult();
	}

	private async asyncValidateResourceFactor(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const resourceValue = value;
		let resource: number | undefined = undefined;
		if (typeof resourceValue === 'number') {
			resource = resourceValue;
		} else {
			resource = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ResourceFactor: resource
		};

		if (entity.QuantityUoMFk && entity.PerformanceFactor && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidatePerformanceFactor(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const performanceValue = value;
		let performance: number | undefined = undefined;
		if (typeof performanceValue === 'number') {
			performance = performanceValue;
		} else {
			performance = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			PerformanceFactor: performance
		};

		if (entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidateQuantityUoMFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const quantityUoMFkValue = value;
		let quantityUoMFk: number | undefined = undefined;
		if (typeof quantityUoMFkValue === 'number') {
			quantityUoMFk = quantityUoMFkValue;
		} else {
			quantityUoMFk = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			UoM: quantityUoMFk
		};

		if (entity.PerformanceFactor && entity.Perf1UoMFk && entity.Perf2UoMFk && entity.Quantity) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		} else if (entity.ParentActivityFk !== null || entity.ActivityTypeFk === 2) {
			parameter.ChangedField = 'CalculateSummary';
			entity.QuantityUoMFk = value as number;
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidateIsQuantityEvaluated(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ChangedField: 'CalculateSummary'
		};

		if (entity.ParentActivityFk !== null) {
			entity.IsQuantityEvaluated = value as boolean;
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidatePerf1UoMFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const perf1UoMFkValue = value;
		let perf1UoMFk: number | undefined = undefined;
		if (typeof perf1UoMFkValue === 'number') {
			perf1UoMFk = perf1UoMFkValue;
		} else {
			perf1UoMFk = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			UoM1: perf1UoMFk
		};

		if (entity.PerformanceFactor && entity.QuantityUoMFk && entity.Perf2UoMFk && entity.Quantity) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidatePerf2UoMFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		const perf2UoMFkValue = value;
		let perf2UoMFk: number | undefined = undefined;
		if (typeof perf2UoMFkValue === 'number') {
			perf2UoMFk = perf2UoMFkValue;
		} else {
			perf2UoMFk = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			UoM2: perf2UoMFk
		};

		if (entity.PerformanceFactor && entity.QuantityUoMFk && entity.Perf1UoMFk && entity.Quantity) {
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidateActivityTemplateFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		if (value !== null) {
			const activityTemplateFkValue = value;
			let activityTemplateFk: number | undefined = undefined;
			if (typeof activityTemplateFkValue === 'number') {
				activityTemplateFk = activityTemplateFkValue;
			} else {
				activityTemplateFk = undefined;  // or handle as needed
			}

			const locationFkValue = entity.LocationFk;
			let locationFk: number | undefined = undefined;
			if (typeof locationFkValue === 'number') {
				locationFk = locationFkValue;
			} else {
				locationFk = undefined;  // or handle as needed
			}

			const parameter:ICalculationActivityEntity = {
				Id: entity.Id,
				ActivityTemplateFk: activityTemplateFk,
				LocationFk: locationFk
			};

			// TODO need to migrate $injector.get('basicsCharacteristicDataServiceFactory').copyCharacteristicAndSynchronisize(schedulingMainService, copyData);
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}

		return new ValidationResult();
	}

	private validateConstraintTypeFk(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		const dateAvailable = this.isRequiredConstraintDateAvailable(value, entity.ConstraintDate ?? '');
		if (this.isConstraintDateEditable(entity.ConstraintTypeFk ?? 0) !== this.isConstraintDateEditable(value ?? 0)) {
			const oldValue = entity.ConstraintTypeFk ?? 0;
			entity.ConstraintTypeFk = value ?? 0;
			// TODO schedulingMainModifyActivityProcessor.processItem(entity);
			entity.ConstraintTypeFk = oldValue;
		}

		if (!this.isConstraintDateEditable(value)) {
			entity.ConstraintDate = null;
		}
		if (!dateAvailable) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.error_constraintTypeRequiresDate');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		return new ValidationResult();
	}

	private validateConstraintDate(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const value = info.value as string;
		if (value === null || value == '') {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.dateIsRequiredForConstraint');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		return new ValidationResult();
	}

	private validatePlannedStart(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as Date;
		const plannedStart = new Date(value);
		const constraintDate = entity.ConstraintDate ? new Date(entity.ConstraintDate) : null;
		if (!plannedStart) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.invaliddate');
			this.dialogService.showMsgBox(errorDialogConfig);
		}

		switch (entity.ConstraintTypeFk) {
			case 1: // AsLateAsPossible
			case 2: // AsSoonAsPossible
			case 3: // FinishNoEarlierThan
			case 4: // FinishNoLaterThan
			case 5: // MustFinishOn
			case 6:
				if (constraintDate && plannedStart && constraintDate.getTime() !== plannedStart.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.mustStartOn');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			case 7:
				if (constraintDate && plannedStart && constraintDate.getTime() > plannedStart.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.startNoEarlierThan');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			case 8: // StartNoLaterThan
				if (constraintDate && plannedStart && constraintDate.getTime() < plannedStart.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.startNoLaterThan');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			default:
		}
		return new ValidationResult();
	}

	private async asyncValidatePlannedStart(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as Date;
		const parameter= { Id: entity.Id, StartDate: new Date(value).toISOString() }as ICalculationActivityEntity;
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
	   return new ValidationResult();
	}

	private validatePlannedFinish(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as Date;
		const plannedStart = entity.PlannedStart ? new Date(entity.PlannedStart) : null;
		const constraintDate = entity.ConstraintDate ? new Date(entity.ConstraintDate) : null;
		const plannedFinish = new Date(value);
		if (!plannedFinish) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorBoxHeader','scheduling.main.errors.noValidDate');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		if (plannedStart && plannedFinish < plannedStart) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorBoxHeader','scheduling.main.errors.finishBeforeStart');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();  // Early return
		}

		switch (entity.ConstraintTypeFk) {
			case this.constraintTypes.AsLateAsPossible:
			case this.constraintTypes.AsSoonAsPossible:
			case this.constraintTypes.FinishNoEarlierThan:
				if (constraintDate && value && constraintDate.getTime() > value.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.mustStartOn');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			case this.constraintTypes.FinishNoLaterThan:
				if (constraintDate && value && constraintDate.getTime() < value.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.finishNoLaterThan');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			case this.constraintTypes.MustFinishOn:
				if (constraintDate && value && constraintDate.getTime() !== value.getTime()) {
					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.mustFinishOn');
					this.dialogService.showMsgBox(errorDialogConfig);
				}
				break;
			case this.constraintTypes.MustStartOn:
			case this.constraintTypes.StartNoEarlierThan:
			case this.constraintTypes.StartNoLaterThan:
			default:
		}
		return new ValidationResult();
	}

	private async asyncValidatePlannedFinish(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as Date;
		const parameter = { Id: entity.Id, EndDate: new Date(value).toISOString() } as ICalculationActivityEntity;
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();
	}

	private async asyncValidateConstraintTypeFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		if ((value !== null && value !== this.constraintTypes.AsLateAsPossible &&
			value !== this.constraintTypes.AsSoonAsPossible) || entity.ExecutionStarted) {
			return new ValidationResult();
		}

		const constraintTypeFkValue = value;
		let constraintTypeFk: number | undefined = undefined;
		if (typeof constraintTypeFkValue === 'number') {
			constraintTypeFk = constraintTypeFkValue;
		} else {
			constraintTypeFk = undefined;  // or handle as needed
		}

		const parameter:ICalculationActivityEntity= {
			Id: entity.Id,
			ConstraintTypeFk: constraintTypeFk,
		};
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();
	}

	private async asyncValidateConstraintDate(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		if (!value) {
			return Promise.resolve(new ValidationResult());
		}

		if (entity.ConstraintTypeFk === this.constraintTypes.MustFinishOn) {
			const constraintDateValue = value;
			let constraintDate: string | undefined = undefined;
			if (typeof constraintDateValue === 'string') {
				constraintDate = constraintDateValue;
			} else {
				constraintDate = undefined;  // or handle as needed
			}
			const parameter:ICalculationActivityEntity = {
				Id: entity.Id,
				EndDate: constraintDate,// Use case: Change of end should shorten or extend duration. Duration is calculated new
				ConstraintDate: constraintDate // set Constraint date must finish on leads to new end date
			};
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});

		}
		if (entity.ConstraintTypeFk === this.constraintTypes.MustStartOn) {
			const constraintDateValue = value;
			let constraintDate: string | undefined = undefined;
			if (typeof constraintDateValue === 'string') {
				constraintDate = constraintDateValue;
			} else {
				constraintDate = undefined;  // or handle as needed
			}
			const parameter:ICalculationActivityEntity = {
				Id: entity.Id,
				StartDate: constraintDate,// set Constraint date must finish on leads to new start date
				ConstraintDate: constraintDate // set Constraint date must finish on leads to new start date
			};

			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidateLocationFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (entity.ActivityTemplateFk && !entity.ControllingUnitFk) {
			const locationFkValue = value;
			let locationFk: number | undefined = undefined;
			if (typeof locationFkValue === 'number') {
				locationFk = locationFkValue;
			} else {
				locationFk = undefined;  // or handle as needed
			}
			const activityTemplateFkValue = entity.ActivityTemplateFk;
			let activityTemplateFk: number | undefined = undefined;
			if (typeof activityTemplateFkValue === 'number') {
				activityTemplateFk = activityTemplateFkValue;
			} else {
				activityTemplateFk = undefined;  // or handle as needed
			}

			const parameter:ICalculationActivityEntity = {
				Id: entity.Id,
				LocationFk: locationFk,
				ActivityTemplateFk: activityTemplateFk,
			};
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private async asyncValidateCalendarFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;

		if (entity.PlannedStart || entity.PlannedFinish) {
			const calendarFkValue = value;
			let calendarFk: number | undefined = undefined;
			if (typeof calendarFkValue === 'number') {
				calendarFk = calendarFkValue;
			} else {
				calendarFk = undefined;  // or handle as needed
			}
			const parameter:ICalculationActivityEntity = {
				Id: entity.Id,
				CalendarFk: calendarFk
			};
			entity.CalendarFk = calendarFk;
			this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
				if (response?.Activities?.length) {
					return this.dataService.calculateActivities(parameter,response);
				} else {
					return null;
				}
			});
		}
		return new ValidationResult();
	}

	private validateActualStart(info: ValidationInfo<IActivityEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ActualFinish?info.entity.ActualFinish.toString():'', 'ActualFinish');
	}

	private async asyncValidateActualStart(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value;
		const actualStartValue = value;
		let actualStart: string | undefined = undefined;
		if (typeof actualStartValue === 'string') {
			actualStart = actualStartValue;
		} else {
			actualStart = undefined;  // or handle as needed
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ActualStart: actualStart,
			ChangedField: 'ActualStart'
		};
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();
	}

	private async asyncValidateActualFinish(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value;
		const actualStartValue = entity.ActualStart;
		let actualStart: string | undefined = undefined;
		if (typeof actualStartValue === 'string') {
			actualStart = actualStartValue;
		} else {
			actualStart = undefined;  // or handle as needed
		}
		const actualFinishValue = value;
		let actualFinish: string | undefined = undefined;
		if (typeof actualFinishValue === 'string') {
			actualFinish = actualFinishValue;
		} else {
			actualFinish = undefined;  // or handle as needed
		}

		if(value && actualStart !== null){
			if (actualStart && actualFinish && actualFinish < actualStart) {
				return Promise.resolve(new ValidationResult());
			}
		}
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ActualFinish: actualFinish,
			ChangedField: 'ActualFinish'
		};

		if (!this.dueDateService.hasDueDate()) {
			this.dueDateService.setPerformanceDueDate(new Date());
		}
		parameter.DueDate = this.dueDateService.getPerformanceDueDateAsString();
		parameter.ProgressDescription = this.dueDateService.getPerformanceDescription();

		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();
	}

	private validateActualFinish(info: ValidationInfo<IActivityEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ActualStart?info.entity.ActualStart.toString():'', <string>info.value, 'ActualStart');
	}

	private validateExecutionStarted(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as Date;
		if (!value && entity.ExecutionFinished) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.noValidDate');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		return new ValidationResult();
	}

	private validatePredecessor(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as IActivityRelationshipEntity[];
		if (value[0].PredecessorCode === entity.Code) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.parentChildAreTheSame');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		return new ValidationResult();
	}

	private validateSuccessor(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as IActivityRelationshipEntity[];
		if (value[0].SuccessorCode === entity.Code) {
			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorDialogTitle', 'scheduling.main.errors.parentChildAreTheSame');
			this.dialogService.showMsgBox(errorDialogConfig);
			return new ValidationResult();
		}
		return new ValidationResult();
	}

	private validateIsDurationEstimationDriven(info: ValidationInfo<IActivityEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value as boolean;
		entity.IsDurationEstimationDriven = value;
		this.dataService.updateFromEstimate(entity, entity.EstimateHoursTotal ?? 0);
		return new ValidationResult();
	}

	private async asyncValidateExecutionStarted(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as boolean;

		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ChangedField: 'ExecutionStarted'
		};
		parameter.ExecutionStarted = value;
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();

	}

	private async asyncValidateExecutionFinished(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as boolean;
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ChangedField: 'ExecutionFinished'
		};

		if (!this.dueDateService.hasDueDate()) {
			this.dueDateService.setPerformanceDueDate(new Date());
		}
		parameter.ExecutionFinished = value;
		parameter.DueDate = this.dueDateService.getPerformanceDueDateAsString();
		parameter.ProgressDescription = this.dueDateService.getPerformanceDescription();

		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();

	}

	private async asyncValidateScheduleSubFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ScheduleSubFk: value
		};
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();

	}

	private async asyncValidateActivitySubFk(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		const parameter:ICalculationActivityEntity = {
			Id: entity.Id,
			ActivitySubFk: value
		};
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
		return new ValidationResult();

	}

	private async asyncValidatePercentageCompletion(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {PercentageCompletion: value});
		return new ValidationResult();
	}

	private async asyncValidateRemainingActivityQuantity(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {RemainingActivityQuantity: value});
		return new ValidationResult();
	}

	private async asyncValidatePeriodQuantityPerformance(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {PeriodQuantityPerformance: value});
		return new ValidationResult();
	}

	private async asyncValidateDueDateWorkPerformance(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {DueDateWorkPerformance: value});
		return new ValidationResult();
	}

	private async asyncValidateRemainingActivityWork(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {RemainingActivityWork: value});
		return new ValidationResult();
	}

	private async asyncValidatePeriodWorkPerformance(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		this.doAsyncProgressCall(entity, {PeriodWorkPerformance: value});
		return new ValidationResult();
	}

	private calculateActivities(parameter: ICalculationActivityEntity, entity: IActivityEntity) {
		const completeActivity = {
			MainItemId: entity.Id,
			Activities: this.getEffectedActivities(parameter, entity),
			Activity: entity,
			ActivityPlanningChange: parameter,
			HasTransientRootEntityInclude: this.dataService.isTransientRootEntityActive()
		};
		return this.http.post<ActivityComplete>('scheduling/main/activity/validate', completeActivity)
			.then((response: ActivityComplete) => {
				return response;
			});
	}

	private isRequiredConstraintDateAvailable(constraintType: number, constraintDate: string) {
		let res = true;

		if (!!constraintType &&
			constraintType !== this.constraintTypes.AsLateAsPossible &&
			constraintType !== this.constraintTypes.AsSoonAsPossible &&
			constraintType !== this.constraintTypes.NoConstraint
		) {
			res = !!constraintDate;
		}
		return res;
	}

	private isConstraintDateEditable(constraintType: number) {
		let res = true;
		if (!constraintType ||
			constraintType === this.constraintTypes.AsLateAsPossible ||
			constraintType === this.constraintTypes.AsSoonAsPossible ||
			constraintType === this.constraintTypes.NoConstraint
		) {
			res = false;
		}
		return res;
	}

	private provideAsyncProgressCallParameterObject(entity:IActivityEntity) {
		return {
			Id: entity.Id,
			DueDate: this.dueDateService.getPerformanceDueDateAsString(),
			ProgressDescription: this.dueDateService.getPerformanceDescription(),
		};
	}

	private doAsyncProgressCall(entity:IActivityEntity,purpose:ICalculationActivityEntity) {
		if (!this.dueDateService.hasDueDate()) {
			this.dueDateService.setPerformanceDueDate(new Date());
		}

		const parameter = this.provideAsyncProgressCallParameterObject(entity);
		// TODO angular.extend(parameter, purpose);
		this.calculateActivities(parameter, entity).then((response: ActivityComplete) => {
			if (response?.Activities?.length) {
				return this.dataService.calculateActivities(parameter,response);
			} else {
				return null;
			}
		});
	}

	private async asyncValidateDueDateQuantityPerformance(info: ValidationInfo<IActivityEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;

		const remainingActivityQuantityValue = entity.RemainingActivityQuantity;
		let remainingActivityQuantity: number | undefined = undefined;
		if (typeof remainingActivityQuantityValue === 'number') {
			remainingActivityQuantity = remainingActivityQuantityValue;
		} else {
			remainingActivityQuantity = undefined;  // or handle as needed
		}
		this.doAsyncProgressCall(entity, {
			DueDateQuantityPerformance: value,
			RemainingActivityQuantity: remainingActivityQuantity
		});
		return new ValidationResult();
	}

}