/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITimeAllocationEntity } from '../../model/entities/time-allocation-entity.interface';
import { TimekeepingTimeallocationItemDataService } from '../timekeeping-timeallocation-item-data.service';

export interface IResponseData{
}


@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationItemValidationService extends BaseValidationService<ITimeAllocationEntity> {
	private dataService = inject(TimekeepingTimeallocationItemDataService);
	protected generateValidationFunctions(): IValidationFunctions<ITimeAllocationEntity> {
		return {
			RecordFk: [this.asyncValidateRecordFk,this.validateIsMandatory,this.validateIsUnique],
			RecordType: [this.validateRecordType],
		};
	}

	private async asyncValidateRecordFk(info: ValidationInfo<ITimeAllocationEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as string;
		this.dataService.setArticleInformation(entity, value);
		return  new ValidationResult();
	}

	private validateRecordType(info: ValidationInfo<ITimeAllocationEntity> ): ValidationResult {
		const entity = info.entity;
		const value = info.value;

		if (value === 1 && entity.IsGenerated) {
			return  new ValidationResult();//TODO need to migrate platformRuntimeDataService.readonly(entity, [{field: 'TotalProductiveHours', readonly: true}]);
		} else {
			return  new ValidationResult(); //TODO need to migrate platformRuntimeDataService.readonly(entity, [{field: 'TotalProductiveHours', readonly: false}]);
		}

	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeAllocationEntity> {
		return this.dataService;
	}

}