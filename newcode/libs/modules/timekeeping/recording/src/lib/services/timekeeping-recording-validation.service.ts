/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingDataService } from './timekeeping-recording-data.service';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingValidationService extends BaseValidationService<IRecordingEntity> {

	private dataService = inject(TimekeepingRecordingDataService);
	protected generateValidationFunctions(): IValidationFunctions<IRecordingEntity> {
		return {
			RubricCategoryFk: [this.validateRubricCategoryFkAsync,this.validateRubricCategoryFk]
		};
	}

	private async validateRubricCategoryFkAsync(info: ValidationInfo<IRecordingEntity>): Promise<ValidationResult>{
		const result= new ValidationResult();
		return result;
	}

	protected validateRubricCategoryFk (info: ValidationInfo<IRecordingEntity>):ValidationResult {
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRecordingEntity> {
		return this.dataService;
	}

}