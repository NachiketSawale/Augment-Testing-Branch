import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { EmployeeComplete, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService } from '../timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeStatusWizardService extends BasicsSharedChangeStatusService<IEmployeeEntity, IEmployeeEntity, EmployeeComplete>{
	protected readonly dataService = inject(TimekeepingEmployeeDataService);

	protected readonly statusConfiguration: IStatusChangeOptions<IEmployeeEntity, EmployeeComplete> = {
		title: 'timekeeping.employee.employeeStatusWizard',
		isSimpleStatus: false,
		statusName: 'employeestatus',
		checkAccessRight: true,
		statusField: 'EmployeeStatusFk',
		rootDataService: this.dataService
	};

	public setEmployeeStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged(): void {
		this.dataService.refreshAll();
	}
}