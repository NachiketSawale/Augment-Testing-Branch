import { IInitializationContext } from '@libs/platform/common';
import {  TimekeepingEmployeeWizardService } from '../../services/wizards/timekeeping-employee-wizard.service';
import { TimekeepingEmployeeStatusWizardService } from '../../services/wizards/timekeeping-employee-status-wizard.service';
import { TimekeepingPlannedAbsenceStatusWizardService } from '../../services/wizards/timekeeping-planned-absence-status-wizard.service';
import { TimekeepingEmployeeSkillStatusWizardService } from '../../services/wizards/timekeeping-employee-skill-status-wizard.service';
import { TimekeepingEnableEmployeeWizardService } from '../../services/wizards/timekeeping-enable-employee-wizard.service';
import { TimekeepingDisableEmployeeWizardService } from '../../services/wizards/timekeeping-disable-employee-wizard.service';

export class TimeKeepingEmployeeWizardClass {


	public createResources(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingEmployeeWizardService);
		service.createResources();
	}
	public generatePlannedAbsences(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingEmployeeWizardService);
		service.generatePlannedAbsences();
	}

	public setEmployeeStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingEmployeeStatusWizardService);
		service.setEmployeeStatus();
	}

	public setPlannedAbsenceStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingPlannedAbsenceStatusWizardService);
		service.setPlannedAbsenceStatus();
	}

	public setEmployeeSkillStatus(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingEmployeeSkillStatusWizardService);
		service.setEmployeeSkillStatus();
	}

	public enableEmployee(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingEnableEmployeeWizardService);
		service.enableEmployee();
	}

	public disableEmployee(context: IInitializationContext) {
		const service = context.injector.get(TimekeepingDisableEmployeeWizardService);
		service.disableEmployee();
	}
}