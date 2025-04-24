import {BasicsSharedSimpleActionWizardService, ISimpleActionOptions} from '@libs/basics/shared';
import {IEngTaskEntity} from '../../model/entities/eng-task-entity.interface';
import {inject, Injectable} from '@angular/core';
import {EngineeringTaskDataService} from '../engineering-task-data.service';

@Injectable({
	providedIn: 'root'
})
export class EngTaskEnableWizardService extends BasicsSharedSimpleActionWizardService<IEngTaskEntity> {
	private engTaskDataService = inject(EngineeringTaskDataService);

	public onStartEnableWizard(): void {
		const option: ISimpleActionOptions<IEngTaskEntity> = {
			headerText: 'productionplanning.engineering.wizard.enableTaskTitle',
			codeField: 'Code',
			doneMsg: 'productionplanning.engineering.wizard.enableDisableTaskDone',
			nothingToDoMsg: 'productionplanning.engineering.wizard.taskAlreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
			placeholder: 'task'
		};
		this.startSimpleActionWizard(option);
	}

	protected override filterToActionNeeded(selected: IEngTaskEntity[]): IEngTaskEntity[] {
		const filteredSelection: IEngTaskEntity[] = [];
		selected.forEach(item => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}

	protected override getSelection(): IEngTaskEntity[] {
		return this.engTaskDataService.getSelection();
	}

	protected override performAction(filtered: IEngTaskEntity[]): void {
		filtered.forEach(item => {
			item.IsLive = true;
			this.engTaskDataService.setModified(item);
		});
	}

	protected override postProcess(): void {
	}
}