/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ISheetEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingSheetDataService } from './timekeeping-recording-sheet-data.service';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingSheetValidationService extends BaseValidationService<ISheetEntity> {
	private dataService = inject(TimekeepingRecordingSheetDataService);
	protected generateValidationFunctions(): IValidationFunctions<ISheetEntity> {
		return {
			EmployeeFk: [this.validateEmployeeFkAsync,this.validateEmployeeFk]
		};
	}

	private async validateEmployeeFkAsync(info: ValidationInfo<ISheetEntity>): Promise<ValidationResult>{
		const result= new ValidationResult();
		return result;
	}

	protected validateEmployeeFk (info: ValidationInfo<ISheetEntity>):ValidationResult {
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ISheetEntity> {
		return this.dataService;
	}

}