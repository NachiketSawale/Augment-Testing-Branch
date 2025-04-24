/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeeWTMEntity, IValidateParams } from '@libs/timekeeping/interfaces';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { TimekeepingEmployeeWorkingTimeModelDataService } from './timekeeping-employee-working-time-model-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeWorkingTimeModelValidationService extends BaseValidationService<IEmployeeWTMEntity>{
	private validators: IValidationFunctions<IEmployeeWTMEntity> | null = null;
	private readonly platformDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly http = inject(PlatformHttpService);

	public constructor(protected dataService: TimekeepingEmployeeWorkingTimeModelDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeWTMEntity>> = PlatformSchemaService<IEmployeeWTMEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeWTMDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeWTMEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<IEmployeeWTMEntity> {
		return {
			ValidFrom: [this.validateValidFrom, this.asyncValidateValidFrom],
			ValidTo: [this.validateValidTo, this.asyncValidateValidTo],
			TimesymbolFk: [this.validateTimesymbolFk],
			EmployeeWorkingTimeModelFk: [this.asyncValidateEmployeeWorkingTimeModelFk]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeWTMEntity> {
		return this.dataService;
	}

	public validateValidFrom (info: ValidationInfo<IEmployeeWTMEntity>) : ValidationResult {

		if(!info.entity.ValidTo) {
			return new ValidationResult();
		}

		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo as string, 'ValidTo');
	}

	public asyncValidateValidFrom (info: ValidationInfo<IEmployeeWTMEntity>): Promise<ValidationResult>{
		return this.validatePeriod(info).then((data) => {
			return {valid: data.valid, error: data.error, error$tr$: data.error};
		});
	}

	public validateValidTo (info: ValidationInfo<IEmployeeWTMEntity>) : ValidationResult {
		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom as string, <string>info.value, 'ValidFrom');
	}

	public asyncValidateValidTo (info: ValidationInfo<IEmployeeWTMEntity>): Promise<ValidationResult>{
		if(info.entity.ValidTo || info.value) {
			return this.validatePeriod(info).then((data) => {
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		} else {
			return Promise.resolve(new ValidationResult());
		}
	}

	private validatePeriod(info: ValidationInfo<IEmployeeWTMEntity>): Promise<ValidationResult>{

		const params: IValidateParams = {Valid: false};
		params.EmployeeWTMToValidate = structuredClone(info.entity);
		if (info.field === 'ValidFrom') {
			params.EmployeeWTMToValidate.ValidFrom = info.value as string;
			if (info.entity.ValidTo) {
				params.EmployeeWTMToValidate.ValidTo = info.entity.ValidTo;
			}
		}
		if (info.field === 'ValidTo') {
			params.EmployeeWTMToValidate.ValidFrom = info.entity.ValidFrom;
			if(info.value){
				params.EmployeeWTMToValidate.ValidTo = info.value as string;
			}
		}

		const updateData = this.dataService.getModified();
		//TODO Check if this works
		if (updateData){
			const list = this.dataService.getList();
			updateData.forEach(d => {
				if (list.includes(d)){
					params.EmployeeWTMToSave = updateData;
				} else {
					params.EmployeeWTMToDelete = updateData;
				}
			});
		}

		this.http.post<IValidateParams>(
				'timekeeping/employee/employeewtm/validateperiod', params)
			.then((response) => {
				if (response && response && response.Valid) {
					this.ensureNoRelatedError(this.getEntityRuntimeData(), info, [info.field]);
					if (response.ChangedEmployeeWTM) {
						//TODO takeOverItem
						// timekeepingEmployeeWTMDataService.takeOverItem(response.ChangedEmployeeWTM);
					}
					return new ValidationResult();
				} else {
					return new ValidationResult(response.ValidError as string);
				}
			}, () => {
				return new ValidationResult('unknown issue');
			});

		return Promise.resolve(new ValidationResult());
	}

	public validateTimesymbolFk (info: ValidationInfo<IEmployeeWTMEntity>) : ValidationResult {

		if (info.entity.TimesymbolFk && info.entity.HasOptedPayout) {
			return this.validateIsMandatory(info);
		}

		return new ValidationResult();
	}

	public asyncValidateEmployeeWorkingTimeModelFk(info: ValidationInfo<IEmployeeWTMEntity>): Promise<ValidationResult>{
		const postData ={PKey1:info.value};
		return Promise.resolve(this.http.post<IEmployeeWTMEntity[]>('timekeeping/worktimemodel/getWorkTimeModelList',postData).then((result) => {
			if (result && result.length > 0) {
				info.entity.EmployeeFallbackWTM = result[0].EmployeeFallbackWTM;
			}
			return new ValidationResult();
			//TODO complete validation
		}));
	}
}