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

export class TimekeepingEnableEmployeeWizardService extends BasicsSharedSimpleActionWizardService<IEmployeeEntity> {

	private readonly employeeDataService = inject(TimekeepingEmployeeDataService);

	public enableEmployee() {
		this.startSimpleActionWizard({
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: 'timekeeping.employee.enableDone',
			nothingToDoMsg: 'timekeeping.employee.alreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection'
		});
	}

	protected filterToActionNeeded(selected: IEmployeeEntity[]): IEmployeeEntity[] {
		const filteredSelection: IEmployeeEntity[] = [];
		selected.forEach(item => {
			if (!item.IsLive) {
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
			item.IsLive = true;
			this.employeeDataService.setModified(item);
		});
	}

	protected postProcess(): void {
		//TODO refreshAll doesn't work?
		this.employeeDataService.refreshAll();
	}

}