/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, EntityDateProcessorFactory, IDataServiceChildRoleOptions, IDataServiceOptions, IEntityProcessor } from '@libs/platform/data-access';
import { IPlannedAbsenceEntity, EmployeeComplete, PlannedAbsenceComplete, IEmployeeEntity} from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from './timekeeping-employee-data.service';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePlannedAbsenceDataService extends DataServiceFlatNode<IPlannedAbsenceEntity,
	PlannedAbsenceComplete, IEmployeeEntity, EmployeeComplete> {
	public constructor(timekeepingEmployeeDataService : TimekeepingEmployeeDataService) {
		const options: IDataServiceOptions<IPlannedAbsenceEntity> = {
			apiUrl: 'timekeeping/employee/plannedabsence',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPlannedAbsenceEntity,
				IEmployeeEntity, EmployeeComplete>>{
				role: ServiceRole.Node,
				itemName: 'PlannedAbsences',
				parent: timekeepingEmployeeDataService
			}
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: {dtos: IPlannedAbsenceEntity[]}): IPlannedAbsenceEntity[] {
		if (loaded){
			return loaded.dtos;
		}

		return [];
	}

	public override isParentFn(parentKey: IEmployeeEntity, entity: IPlannedAbsenceEntity): boolean {
		return entity.EmployeeFk == parentKey.Id;
	}

	public override createUpdateEntity(modified: IPlannedAbsenceEntity | null): PlannedAbsenceComplete {
		const complete = new PlannedAbsenceComplete();

		if (modified){
			complete.MainItemId = modified.Id;
			complete.PlannedAbsences = modified;
		}
		return complete;
	}
	protected override provideAllProcessor(options: IDataServiceOptions<IPlannedAbsenceEntity>): IEntityProcessor<IPlannedAbsenceEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		allProcessor.push(this.provideDateProcessor());
		return allProcessor;
	}

	private provideDateProcessor(): IEntityProcessor<IPlannedAbsenceEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<IPlannedAbsenceEntity>({ moduleSubModule: 'Timekeeping.Employee', typeName: 'PlannedAbsenceDto' });
	}
}
