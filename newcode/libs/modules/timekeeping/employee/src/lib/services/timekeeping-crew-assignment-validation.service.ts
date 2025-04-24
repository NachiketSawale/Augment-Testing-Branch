/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { ICrewAssignmentEntity } from '@libs/timekeeping/interfaces';
import { PlatformDateService, PlatformHttpService } from '@libs/platform/common';
import { TimekeepingCrewAssignmentDataService } from './timekeeping-crew-assignment-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { last } from 'lodash';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { IValidateParams } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingCrewAssignmentValidationService extends BaseValidationService<ICrewAssignmentEntity>{
	private validators: IValidationFunctions<ICrewAssignmentEntity> | null = null;
	private readonly platformDateService = inject(PlatformDateService);
	private readonly platformDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly employeeDataService = inject(TimekeepingEmployeeDataService);
	private readonly http = inject(PlatformHttpService);

	public constructor(protected dataService: TimekeepingCrewAssignmentDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ICrewAssignmentEntity>> = PlatformSchemaService<ICrewAssignmentEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'CrewAssignmentDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ICrewAssignmentEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<ICrewAssignmentEntity> {
		return {
			FromDateTime: [this.validateFromDateTime, this.asyncValidateFromDateTime],
			ToDateTime: [this.validateToDateTime, this.asyncValidateToDateTime],
			EmployeeCrewFk: [this.validateEmployeeCrewFk]
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICrewAssignmentEntity> {
		return this.dataService;
	}

	public validateFromDateTime (info: ValidationInfo<ICrewAssignmentEntity>) : ValidationResult {

		if(!info.entity.ToDateTime) {
			return new ValidationResult();
		}

		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ToDateTime as string, 'ToDateTime');
	}

	public asyncValidateFromDateTime (info: ValidationInfo<ICrewAssignmentEntity>): Promise<ValidationResult>{
		return this.validatePeriod(info).then((data) => {
			return {valid: data.valid, error: data.error, error$tr$: data.error};
		});
	}

	public validateToDateTime (info: ValidationInfo<ICrewAssignmentEntity>) : ValidationResult {
		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, info.entity.FromDateTime as string, <string>info.value, 'FromDateTime');
	}

	public asyncValidateToDateTime (info: ValidationInfo<ICrewAssignmentEntity>): Promise<ValidationResult>{
		if(info.entity.ToDateTime || info.value) {
			return this.validatePeriod(info).then((data) => {
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		} else {
			return Promise.resolve(new ValidationResult());
		}
	}

	public validateEmployeeCrewFk (info: ValidationInfo<ICrewAssignmentEntity>): ValidationResult {

		const result =  this.platformDataValidationService.validateIsDefault(info, this.dataService);
		if (result && result.valid) {
			const lastItem = last(this.dataService.getList().sort((a,b) => {
				const fromA = this.platformDateService.getUTC(a.FromDateTime as string).getDate();
				const fromB = this.platformDateService.getUTC(b.FromDateTime as string).getDate();

				if (fromA <= fromB){
					return -1;
				} else {
					return 1;
				}
			}));

			if (lastItem && lastItem.Id === info.entity.Id) {
				lastItem.EmployeeCrewFk = info.value as number;
			}
			this.employeeDataService.setCrewLeader(lastItem);
		}
		return result;
	}

	private validatePeriod(info: ValidationInfo<ICrewAssignmentEntity>): Promise<ValidationResult>{

		const params: IValidateParams = {Valid: false};
		params.CrewAssignmentToValidate = structuredClone(info.entity);
		if (info.field === 'FromDateTime') {
			params.CrewAssignmentToValidate.FromDateTime = info.value as string;
			if (info.entity.ToDateTime) {
				params.CrewAssignmentToValidate.ToDateTime = info.entity.ToDateTime;
			}
		}
		if (info.field === 'ToDateTime') {
			params.CrewAssignmentToValidate.FromDateTime = info.entity.FromDateTime;
			if(info.value){
				params.CrewAssignmentToValidate.ToDateTime = info.value as string;
			}
		}

		const updateData = this.dataService.getModified();
		//TODO Check if this works
		if (updateData){
			const list = this.dataService.getList();
			updateData.forEach(d => {
				if (list.includes(d)){
					params.CrewAssignmentsToSave = updateData;
				} else {
					params.CrewAssignmentsToDelete = updateData;
				}
			});
		}

		this.http.post<IValidateParams>(
				'timekeeping/employee/crewassignment/validateperiod', params)
			.then((response) => {
				if (response && response && response.Valid) {
					this.ensureNoRelatedError(this.getEntityRuntimeData(), info, [info.field]);
					if (response.ChangedCrewAssignment) {
						//TODO takeOverItem
						// timekeepingCrewAssignmentDataService.takeOverItem(response.ChangedCrewAssignment);
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
}