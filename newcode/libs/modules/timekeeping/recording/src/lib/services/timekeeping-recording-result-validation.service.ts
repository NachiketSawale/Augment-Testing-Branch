/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingResultDataService } from './timekeeping-recording-result-data.service';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingRecordingResultValidationService extends BaseValidationService<ITimekeepingResultEntity> {

	private dataService = inject(TimekeepingRecordingResultDataService);
	protected generateValidationFunctions(): IValidationFunctions<ITimekeepingResultEntity> {
		return {
			ProjectActionFk: [this.validateProjectActionFkAsync,this.validateProjectActionFk]
		};
	}

	private async validateProjectActionFkAsync(info: ValidationInfo<ITimekeepingResultEntity>): Promise<ValidationResult>{
		// TODO needs to migrate the registerDataProviderByType function from UiCommonLookupEndpointDataService service
		const result= new ValidationResult();
		return result;
	}

	protected validateProjectActionFk (info: ValidationInfo<ITimekeepingResultEntity>):ValidationResult {
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimekeepingResultEntity> {
		return this.dataService;
	}
}