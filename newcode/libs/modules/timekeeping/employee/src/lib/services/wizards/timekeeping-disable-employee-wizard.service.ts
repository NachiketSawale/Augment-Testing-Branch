/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedSimpleActionWizardService } from '@libs/basics/shared';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { inject, Injectable } from '@angular/core';
import { TimekeepingEmployeeDataService } from '../timekeeping-employee-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingDisableEmployeeWizardService extends BasicsSharedSimpleActionWizardService<IEmployeeEntity> {

	private readonly employeeDataService = inject(TimekeepingEmployeeDataService);

	public disableEmployee() {
		this.startSimpleActionWizard({
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: 'timekeeping.employee.disableDone',
			nothingToDoMsg: 'timekeeping.employee.alreadyDisabled',
			questionMsg: 'cloud.common.questionDisableSelection'
		});
	}

	protected filterToActionNeeded(selected: IEmployeeEntity[]): IEmployeeEntity[] {
		const filteredSelection: IEmployeeEntity[] = [];
		selected.forEach(item => {
			if (item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	protected getSelection(): IEmployeeEntity[] {
		return this.employeeDataService.getSelection();
	}

	protected performAction(filtered: IEmployeeEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = false;
			this.employeeDataService.setModified(item);
		});
		this.employeeDataService.refreshAll();
	}

	protected postProcess(): void {
		this.employeeDataService.refreshAll();
	}
}