/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable  } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { SchedulingScheduleDataService } from '../scheduling-schedule-data.service';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService } from '@libs/platform/common';
import { IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

export interface IResponseData{
	ScheduleFk: number,
	TargetStart: dateFns,
	TargetEnd: dateFns,
	ActivityFkEarliestTime: number,
	ActivityEarliestTimeCode: string,
	ActivityEarliestTime: string,
	ActivityFkLatestTime: number,
	ActivityLatestTimeCode: string,
	ActivityLatestTime: string
}

@Injectable({
	providedIn: 'root'
})


export class SchedulingScheduleValidationService extends BaseValidationService<IScheduleEntity> {

	private dataService = inject(SchedulingScheduleDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	protected generateValidationFunctions(): IValidationFunctions<IScheduleEntity> {
		return {
			Code: [this.ValidateCode],
			TargetStart:[this.ValidateTargetStart,this.asyncValidateTargetStart],
			TargetEnd:[this.ValidateTargetEnd,this.asyncValidateTargetEnd],
			ScheduleTypeFk:[this.asyncValidateScheduleTypeFk],
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IScheduleEntity> {
		return this.dataService;
	}

	protected ValidateCode (info: ValidationInfo<IScheduleEntity>):ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), false);
	}

	private ValidateTargetStart(info: ValidationInfo<IScheduleEntity>): ValidationResult {
		//TODO: why the type of the value is string not date.
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.TargetEnd?info.entity.TargetEnd.toString():'', 'TargetEnd');
	}

	private ValidateTargetEnd(info: ValidationInfo<IScheduleEntity>): ValidationResult {
		//TODO: why the type of the value is string not date.
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.TargetStart?info.entity.TargetStart.toString():'', <string>info.value, 'TargetStart');
	}

	private async asyncValidateTargetStart(info: ValidationInfo<IScheduleEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		if (!value) {
			return Promise.resolve(new ValidationResult());
		}
		const validationData = {
			DateValue: value,
			ScheduleId: entity.Id
		};
		this.http.post<IResponseData[]>('scheduling/schedule/validateTargetStart', validationData)
			.then((result: IResponseData[]) => {
				if (result.length > 0) {
					const insertedDate = value.toString();
					let activitiesErrorCodeText = '';
					const activityEarliestTimeEntity = result[0];
					const activityEarliestTime = new Date(activityEarliestTimeEntity.ActivityEarliestTime).toLocaleDateString();
					result.forEach((element: IResponseData, index: number) => {
						if (index === (result.length - 1)) {
							activitiesErrorCodeText += element.ActivityEarliestTimeCode + '\n';
						} else {
							activitiesErrorCodeText += element.ActivityEarliestTimeCode + ',' + '\n';
						}
					});
					const errorDialogConfig: IMessageBoxOptions = {
						headerText: 'cloud.common.errorBoxHeader',
						bodyText: `Date of Target Start: ${insertedDate} is not valid, Activities with the following Date: ${activityEarliestTime} start earlier. \nActivity by Code: ${activitiesErrorCodeText}`,
						buttons: [{ id: StandardDialogButtonId.Ok }],
						iconClass: 'ico-error'
					};
					this.dialogService.showMsgBox(errorDialogConfig);
					return false;
				}else{
					return true;
				}
			});
		return new ValidationResult();
	}

	private async asyncValidateTargetEnd(info: ValidationInfo<IScheduleEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value;
		if (!value) {
			return Promise.resolve(new ValidationResult());
		}
		const validationData = {
			DateValue: value,
			ScheduleId: entity.Id
		};
		this.http.post<IResponseData[]>('scheduling/schedule/validateTargetEnd', validationData)
			.then((result: IResponseData[]) => {
				if (result.length > 0) {
					const insertedDate = value.toString();
					let activitiesErrorCodeText = '';
					const activityEarliestTimeEntity = result[0];
					const activityEarliestTime = new Date(activityEarliestTimeEntity.ActivityEarliestTime).toLocaleDateString();
					result.forEach((element: IResponseData, index: number) => {
						if (index === (result.length - 1)) {
							activitiesErrorCodeText += element.ActivityEarliestTimeCode + '\n';
						} else {
							activitiesErrorCodeText += element.ActivityEarliestTimeCode + ',' + '\n';
						}
					});
					const errorDialogConfig: IMessageBoxOptions = {
						headerText: 'cloud.common.errorBoxHeader',
						bodyText: `Date of Target End: ${insertedDate} is not valid. Activities with the following Date: ${activityEarliestTime} end later. \nActivity by Code: ${activitiesErrorCodeText}`,
						buttons: [{ id: StandardDialogButtonId.Ok }],
						iconClass: 'ico-error'
					};
					this.dialogService.showMsgBox(errorDialogConfig);
					return false;
				}else{
					return true;
				}
			});
		return new ValidationResult();
	}

	private async asyncValidateScheduleTypeFk(info: ValidationInfo<IScheduleEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value;
		if (!value) {
			return Promise.resolve(new ValidationResult());
		}
		const validationData = {
			ScheduleTypeId: value,
			ScheduleId: entity.Id
		};
		this.http.post<IScheduleEntity>('scheduling/schedule/setdefstatusandrubriccatbytype', validationData)
			.then((result: IScheduleEntity) => {
				if (result) {
					entity.ScheduleStatusFk = result.ScheduleStatusFk;
					entity.RubricCategoryFk = result.RubricCategoryFk;
					return result;
				}else{
					const errorDialogConfig: IMessageBoxOptions = {
						headerText: 'cloud.common.errorBoxHeader',
						bodyText: 'scheduling.schedule.noStatusDefault',
						buttons: [{ id: StandardDialogButtonId.Ok }],
						iconClass: 'ico-error'
					};
					this.dialogService.showMsgBox(errorDialogConfig);
					return false;
				}
			});
		return new ValidationResult();
	}

}