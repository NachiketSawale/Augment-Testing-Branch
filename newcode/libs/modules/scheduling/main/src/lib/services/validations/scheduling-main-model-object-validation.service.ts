/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IActivity2ModelObjectEntity, IActivityEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService } from '@libs/platform/common';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { SchedulingMainModelObjectDataService } from '../scheduling-main-model-object-data.service';
import { IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

/**
 * Scheduling Main Model Object Validation Service
 */

export interface IParameterData {
	Id?: number|undefined,
	Duration?: number | undefined,
	StartDate?: Date | string | undefined,
	EndDate?: Date | string | undefined,
	Activity2ModelObject?: IActivity2ModelObjectEntity | null | undefined,
	Activity?: IActivityEntity | null | undefined,
}

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainModelObjectValidationService extends BaseValidationService<IActivity2ModelObjectEntity> {

	private readonly http = inject(PlatformHttpService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly schedulingMainService = inject(SchedulingMainDataService);
	private readonly dialogService = inject(UiCommonMessageBoxService);

	/**
	 * constructor
	 * @param dataService SchedulingMainModelObjectDataService
	 * @protected
	 */
	public constructor(protected dataService: SchedulingMainModelObjectDataService) {
		super();
	}

	/**
	 * generateValidationFunctions
	 * @protected
	 */
	protected generateValidationFunctions(): IValidationFunctions<IActivity2ModelObjectEntity> {
		return {
			PlannedStart: [this.validatePlannedStart, this.asyncValidatePlannedStart],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActivity2ModelObjectEntity> {
		return this.dataService;
	}

	private validDate(value: Date, model: string) {
		const selectedActivity = this.schedulingMainService.getSelectedEntity();
		if (selectedActivity) {
			const plannedStart = selectedActivity.PlannedStart ? new Date(selectedActivity.PlannedStart).getTime() : null;
			const plannedFinish = selectedActivity.PlannedFinish ? new Date(selectedActivity.PlannedFinish).getTime() : null;
			const inputValue = value.getTime();

			if (plannedStart !== null && plannedFinish !== null) {
				if (inputValue > plannedFinish || inputValue < plannedStart) {
					const message = model === 'PlannedStart'
						? 'scheduling.main.modelobject.errorPlannedStart'
						: 'scheduling.main.modelobject.errorPlannedFinish';

					const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorBoxHeader',message);
					this.dialogService.showMsgBox(errorDialogConfig);
					return new ValidationResult();  // Early return
				}
			} else {

				const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorBoxHeader','scheduling.main.errors.invalidDateRange');
				this.dialogService.showMsgBox(errorDialogConfig);
				return new ValidationResult();
			}
		}
		return new ValidationResult();
	}

	private validatePlannedStart(info: ValidationInfo<IActivity2ModelObjectEntity>): ValidationResult {
		const value = info.value as Date;
		const plannedStart: Date | null = typeof value === 'string' || value instanceof Date ? new Date(value) : null;

		// Ensure start of the day is set
		if (plannedStart) {
			plannedStart.setHours(0, 0, 0, 0);
		}

		if (!plannedStart || isNaN(plannedStart.getTime())) {

			const errorDialogConfig: IMessageBoxOptions = this.createErrorMessage('cloud.common.errorBoxHeader','scheduling.main.errors.noValidDate');
			this.dialogService.showMsgBox(errorDialogConfig);
		} else {
			return this.validDate(value, 'PlannedStart');
		}

		return new ValidationResult();
	}

	private createErrorMessage(header: string, body: string): IMessageBoxOptions {
		return {
			headerText: header,
			bodyText: body,
			buttons: [{ id: StandardDialogButtonId.Ok }],
			iconClass: 'ico-error'
		};
	}

	private async asyncValidatePlannedStart(info: ValidationInfo<IActivity2ModelObjectEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as Date;
		const parameter: IParameterData = {StartDate: value};
		if (entity.PlannedDuration) {
			parameter.Duration = entity.PlannedDuration;
		} else if (entity.PlannedFinish) {
			parameter.EndDate = entity.PlannedFinish;
		}
		parameter.Id = entity.Id as number;
		parameter.Activity = this.schedulingMainService.getSelectedEntity();
		parameter.Activity2ModelObject = entity;

		this.calculate(parameter);
		return new ValidationResult();
	}

	private calculate(parameter: IParameterData) {
		return this.http.post<IActivity2ModelObjectEntity>('scheduling/main/ojectmodelsimulation/calculate', parameter)
			.then((response: IActivity2ModelObjectEntity) => {
				return response;
			});
	}

}