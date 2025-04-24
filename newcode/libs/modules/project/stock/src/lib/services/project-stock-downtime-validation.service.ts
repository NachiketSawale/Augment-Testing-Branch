/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IProjectStockDownTimeEntity } from '@libs/project/interfaces';
import { ProjectStockDowntimeService } from './project-stock-downtime.service';
import { PropertyType } from '@libs/platform/common';

/**
 * Project stock downtime validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectStockDowntimeValidationService extends BaseValidationService<IProjectStockDownTimeEntity> {
	private dataService = inject(ProjectStockDowntimeService);
	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IProjectStockDownTimeEntity>) : ValidationInfo<IProjectStockDownTimeEntity> | undefined => {
		switch (info.field) {
			case 'StartDate':
				return new ValidationInfo(info.entity, info.entity.EndDate, 'EndDate');
			case 'EndDate':
				return new ValidationInfo(info.entity, info.entity.StartDate, 'StartDate');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};


	protected generateValidationFunctions(): IValidationFunctions<IProjectStockDownTimeEntity> {
		return {

			StartDate: this.validateStartDate,
			EndDate: this.validateValidEndDate,
			BasClerkFk: this.validateBasClerkFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectStockDownTimeEntity> {
		return this.dataService;
	}

	private validateStartDate(info: ValidationInfo<IProjectStockDownTimeEntity>): ValidationResult {

		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidEndDate(info: ValidationInfo<IProjectStockDownTimeEntity>): ValidationResult {

		return this.validateIsValidTimeSpanTo(info);
	}


	private validateBasClerkFk(info: ValidationInfo<IProjectStockDownTimeEntity>): ValidationResult {
		const result = new ValidationResult();
		if(this.validationFk(info.value)){
			result.valid = false;
			result.apply= true;
			result.error = 'cloud.common.emptyOrNullValueErrorMessage';
		}
		return result;
	}

	private validationFk(value: PropertyType | undefined ): boolean {
		return (
			value === undefined ||
			value === null ||
			value === '' ||
			value === -1 ||
			value === 0
		);
	}

}