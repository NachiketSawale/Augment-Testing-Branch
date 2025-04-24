import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { EmployeeComplete, IEmployeeEntity, IPlannedAbsenceEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeePlannedAbsenceDataService } from '../timekeeping-employee-planned-absence-data.service';
import { TimekeepingEmployeeDataService } from '../timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingPlannedAbsenceStatusWizardService extends BasicsSharedChangeStatusService<IPlannedAbsenceEntity, IEmployeeEntity, EmployeeComplete>{
	protected readonly dataService = inject(TimekeepingEmployeePlannedAbsenceDataService);
	private readonly employeeDataService = inject(TimekeepingEmployeeDataService);

	protected readonly statusConfiguration: IStatusChangeOptions<IEmployeeEntity, EmployeeComplete> = {
		title: 'basics.customize.plannedabsencestatus',
		isSimpleStatus: false,
		statusName: 'plannedabsencestatus',
		checkAccessRight: true,
		statusField: 'PlannedAbsenceStatusFk',
		rootDataService: this.employeeDataService
	};

	public setPlannedAbsenceStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged(): void {
		//TODO make Fields readonly if status readonly is true, Where to do that? here or in server?
		const selected = this.employeeDataService.getSelectedEntity();
		if (selected) {
			this.employeeDataService.select(selected);
		}
	}
}