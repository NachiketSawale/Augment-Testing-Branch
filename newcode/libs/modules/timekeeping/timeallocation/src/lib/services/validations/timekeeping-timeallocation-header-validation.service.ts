/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITimeAllocationHeaderEntity } from '../../model/entities/time-allocation-header-entity.interface';
import { TimekeepingTimeallocationHeaderDataService } from '../timekeeping-timeallocation-header-data.service';
import { cloneDeep, isNil } from 'lodash';
import { IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

export interface IResponseData{
}


@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeallocationHeaderValidationService extends BaseValidationService<ITimeAllocationHeaderEntity> {
	private dataService = inject(TimekeepingTimeallocationHeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	protected generateValidationFunctions(): IValidationFunctions<ITimeAllocationHeaderEntity> {
		return {
			ProjectFk: [this.asyncValidateProjectFk],
			JobFk: [this.asyncValidateJobFk],
			AllocationDate: [this.asyncValidateAllocationDate,this.ValidateAllocationDate],
			Allocationenddate: [this.ValidateAllocationenddate,this.asyncValidateAllocationenddate],
		};
	}

	private async asyncValidateProjectFk(info: ValidationInfo<ITimeAllocationHeaderEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value;
		entity.JobFk = null;
		if (value===null) {
			return Promise.resolve(new ValidationResult());
		}

		//TODO need to do action columns append logic

		return  new ValidationResult();
	}

	private async asyncValidateJobFk(info: ValidationInfo<ITimeAllocationHeaderEntity>): Promise<ValidationResult>{

		//TODO need to do action columns append logic

		return  new ValidationResult();
	}

	private async asyncValidateAllocationDate(info: ValidationInfo<ITimeAllocationHeaderEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as string;
		this.doValidateEntity(entity, value ?? '', 'AllocationDate');
		return  new ValidationResult();
	}

	private async asyncValidateAllocationenddate(info: ValidationInfo<ITimeAllocationHeaderEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as string;
		this.doValidateEntity(entity, value, 'Allocationenddate');
		return new ValidationResult();
	}

	private ValidateAllocationenddate(info: ValidationInfo<ITimeAllocationHeaderEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.AllocationDate?info.entity.AllocationDate.toString():'', 'AllocationDate');
	}

	private ValidateAllocationDate(info: ValidationInfo<ITimeAllocationHeaderEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.Allocationenddate?info.entity.Allocationenddate.toString():'', 'Allocationenddate');
	}

	private doValidateEntity(entity: ITimeAllocationHeaderEntity, value:string, model: string){
		const item = cloneDeep(entity);
		if(model==='AllocationDate'){
			item.AllocationDate = value;
		}else if(model==='Allocationenddate'){
			item.Allocationenddate = value;
		}
		if (item.ProjectFk > 0 && !isNil(item.AllocationDate)) {
			this.http.post<boolean>('timekeeping/timeallocation/header/isunique', item)
				.then((result) => {
					if (!result) {
						const errorDialogConfig: IMessageBoxOptions = {
							headerText: 'cloud.common.errorBoxHeader',
							bodyText: 'timekeeping.timeallocation.errorSameResultHeader',
							buttons: [{ id: StandardDialogButtonId.Ok }],
							iconClass: 'ico-error'
						};
						this.dialogService.showMsgBox(errorDialogConfig);
						return false;
					}else{
						if(item.ProjectFk>0){
							return true;
						}
						return false;
					}
				});
		}
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeAllocationHeaderEntity> {
		return this.dataService;
	}

}