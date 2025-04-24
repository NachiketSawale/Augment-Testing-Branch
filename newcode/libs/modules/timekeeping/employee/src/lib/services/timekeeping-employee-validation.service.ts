/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { PlatformDateService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ICrewMemberEntity, EmployeeComplete, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { IMessageBoxOptions, UiCommonMessageBoxService } from '@libs/ui/common';
import { TimekeepingCrewAssignmentDataService } from './timekeeping-crew-assignment-data.service';
import { findLast } from 'lodash';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeValidationService extends BaseValidationService<IEmployeeEntity> {
	private validators: IValidationFunctions<IEmployeeEntity> | null = null;
	private readonly http = inject(PlatformHttpService);
	private readonly platformDateService = inject(PlatformDateService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly dialogService = inject(UiCommonMessageBoxService);


	public constructor(protected dataService: TimekeepingEmployeeDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeEntity>> = PlatformSchemaService<IEmployeeEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IEmployeeEntity> {
		return {
			IsCrewLeader: [this.asyncValidateIsCrewLeader],
			Code: [this.asyncValidateCode],
			TimekeepingGroupFk: [this.asyncValidateTimekeepingGroupFk],
			VacationBalance: [this.asyncValidateVacationBalance],
			YearlyVacation: [this.asyncValidateYearlyVacation],
			CrewLeaderFk: [this.asyncValidateCrewLeaderFk]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeEntity> {
		return this.dataService;
	}

	public asyncValidateIsCrewLeader(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult>{
		if (!info.value) {
			const postData = {PKey1:info.entity.Id, filter:''};
			return this.http.post<ICrewMemberEntity[]>('timekeeping/employee/crewmember/listByParent', postData)
				.then((response) => {
					for (const item of response) {
						const databaseDatetime = this.platformDateService.getUTC(item.ToDateTime?.toString());
						const currentDatetime = this.platformDateService.getCurrentUtcDate();
						if (!databaseDatetime.valueOf() || databaseDatetime.valueOf() > currentDatetime.valueOf()) {
							const modalOptionsfailed: IMessageBoxOptions = {
								headerText: this.translate.instant('timekeeping.employee.warning'),
								bodyText: this.translate.instant('timekeeping.employee.crewassignmsg'),
								iconClass: 'ico-info'
							};
							this.dialogService.showMsgBox(modalOptionsfailed);
							return new ValidationResult(this.translate.instant('timekeeping.employee.crewassignmsg').text);
						}
					}
					return new ValidationResult();
				});
		}
		return new Promise<ValidationResult>(resolve => {
			resolve(new ValidationResult());
		});
	}

	public asyncValidateCode(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult>{
		let tgFk = 0;
		if(info.entity?.TimekeepingGroupFk){
			tgFk = info.entity?.TimekeepingGroupFk as number;
		}
		if(tgFk > 0 && info.value){
			return this.overlapsGroupCode(info, info.value.toString(), info.entity.TimekeepingGroupFk?.toString()).then((data) => {
				if(!data){
					return new ValidationResult(this.translate.instant('timekeeping.employee.overlaps').text);
				}
				this.ensureNoRelatedError(this.getEntityRuntimeData(),info,['TimekeepingGroupFk']);
				return new ValidationResult();
			});
		}
		return new Promise<ValidationResult>(resolve => {
			resolve(new ValidationResult());
		});
	}

	public asyncValidateTimekeepingGroupFk(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult>{
		if(info.entity.Code && info.value as number > 0) {
			return this.overlapsGroupCode(info, info.entity.Code?.toString(), info.value?.toString()).then((data) => {
				if (!data) {
					return new ValidationResult(this.translate.instant('timekeeping.employee.overlaps').text);
				}
				this.ensureNoRelatedError(this.getEntityRuntimeData(),info,['Code']);
				return new ValidationResult();
			});
		}
		return new Promise<ValidationResult>(resolve => {
			resolve(new ValidationResult());
		});
	}

	public asyncValidateVacationBalance(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult>{
		let vBalance = 0;
		if (info.entity?.VacationBalance){
			vBalance = info.entity?.VacationBalance as number;
		}
		const difference =  info.value as number - vBalance;
		if (difference && difference !== 0) {
			return this.http.get('timekeeping/employee/adjustvacationbalance?newbalance='+difference+'&employeeid='+info.entity.Id)
				.then(function (response) {
					return new ValidationResult();
				});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateYearlyVacation(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult>{
		let vBalance: number = 0;
		if (info.entity?.VacationBalance){
			vBalance = info.entity?.VacationBalance as number;
		}
		const difference =  info.value as number - vBalance;
		if (difference && difference !== 0) {
			return this.http.get('timekeeping/employee/adjustyearlyvacation?employeeid='+ info.entity.Id +'&yearlyvacation='+ info.value?.toString())
				.then(function (response) {
					info.entity.VacationBalance = info.value as number;
					return new ValidationResult();
				});
		} else {
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
	}

	public asyncValidateCrewLeaderFk(info: ValidationInfo<IEmployeeEntity>) : Promise<ValidationResult> {
		const timekeepingCrewAssignmentDataService = inject(TimekeepingCrewAssignmentDataService);
		if (info.value as number > 0) {
			const recentAssignment = findLast(timekeepingCrewAssignmentDataService.getList(),item =>{
				return item.ToDateTime === null;
			});

			if (recentAssignment) {
				recentAssignment.EmployeeCrewFk = info.value as number;
				const utc = this.platformDateService.getUTC(recentAssignment.ToDateTime?.toString());
				const minutes = utc.getMinutes();
				utc.setMinutes(minutes + 1);
				recentAssignment.FromDateTime = utc.toUTCString();
				timekeepingCrewAssignmentDataService.setModified(recentAssignment);
				return new Promise<ValidationResult>(resolve => {
					resolve(new ValidationResult());
				});
			} else {
				const params: EmployeeComplete = new EmployeeComplete();
				params.Employee = structuredClone(info.entity);
				params.Employee.CrewLeaderFk = info.value as number;
				const updateData = timekeepingCrewAssignmentDataService.getModified();
				//TODO Check if this works
				if (updateData){
					const list = timekeepingCrewAssignmentDataService.getList();
					updateData.forEach(d => {
						if (list.includes(d)){
							params.CrewAssignmentsToSave = updateData;
						} else {
							params.CrewAssignmentsToDelete = updateData;
						}
					});
				}

				this.http.post<{data: {Valid: boolean, ChangedCrewAssignment: ICrewMemberEntity,
						CrewAssignmentToValidate: ICrewMemberEntity}}>(
							'timekeeping/employee/crewassignment/createviaemployee', params)
					.then((response) => {
						if (response && response.data && response.data.Valid) {
							if (response.data.ChangedCrewAssignment) {
								//TODO takeOverItem
								// timekeepingCrewAssignmentDataService.takeOverItem(response.data.ChangedCrewAssignment);
							}
							if (response.data.CrewAssignmentToValidate) {
								//TODO takeOverWholeItem
								// timekeepingCrewAssignmentDataService.takeOverWholeItem(response.data.CrewAssignmentToValidate);
							}
						}
					});
			}
		} else {
			const listAssignments = timekeepingCrewAssignmentDataService.getList();
			listAssignments.forEach( (item) => {
				if(!item.ToDateTime){
					item.ToDateTime = this.platformDateService.getCurrentUtcDate().toUTCString();
					timekeepingCrewAssignmentDataService.setModified(item);
				}
				return new Promise<ValidationResult>(resolve => {
					resolve(new ValidationResult());
				});
			});
			return new Promise<ValidationResult>(resolve => {
				resolve(new ValidationResult());
			});
		}
		return new Promise<ValidationResult>(resolve => {
			resolve(new ValidationResult());
		});
	}

	private overlapsGroupCode(info: ValidationInfo<IEmployeeEntity>, code: string, tksGroup?: string): Promise<boolean>{
		return new Promise<boolean>(resolve => {
			resolve(
				this.http.get<boolean>('timekeeping/employee/isunique?id='+ info.entity.Id + '&&code='+ code +'&&timekeepingGroupFk='+tksGroup).then((response) => {
				return response;
			}));
		});
	}
}