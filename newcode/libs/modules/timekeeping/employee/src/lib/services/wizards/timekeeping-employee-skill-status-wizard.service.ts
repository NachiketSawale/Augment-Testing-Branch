import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { EmployeeComplete, IEmployeeEntity, IEmployeeSkillEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDataService } from '../timekeeping-employee-skill-data.service';
import { TimekeepingEmployeeDataService } from '../timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillStatusWizardService extends BasicsSharedChangeStatusService<IEmployeeSkillEntity, IEmployeeEntity, EmployeeComplete>{
	protected readonly dataService = inject(TimekeepingEmployeeSkillDataService);
	private readonly employeeDataService = inject(TimekeepingEmployeeDataService);

	protected readonly statusConfiguration: IStatusChangeOptions<IEmployeeEntity, EmployeeComplete> = {
		title: 'timekeeping.employee.employeeSkillStatusWizard',
		isSimpleStatus: false,
		statusName: 'employeeskillstatus',
		checkAccessRight: true,
		statusField: 'EmployeeSkillStatusFk',
		rootDataService: this.employeeDataService
	};

	public setEmployeeSkillStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged(): void {
		const selected = this.employeeDataService.getSelectedEntity();
		if (selected) {
			this.employeeDataService.select(selected);
		}
	}
}