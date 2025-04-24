import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IWorkTimeModelEntity } from '../../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelDataService } from '../timekeeping-work-time-model-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingWorkTimeModelDisableWizardService extends BasicsSharedSimpleActionWizardService<IWorkTimeModelEntity>{

	private readonly timekeepingWorkTimeModelDataService = inject(TimekeepingWorkTimeModelDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'timekeeping.common.disableDone';
		const nothingToDoMsg = 'timekeeping.common.timeSymbolAlreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IWorkTimeModelEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'CommentText',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IWorkTimeModelEntity[]{
		return this.timekeepingWorkTimeModelDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IWorkTimeModelEntity[]): IWorkTimeModelEntity[]{
		const filteredSelection: IWorkTimeModelEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if(item.IsLive){
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}


	public override performAction(filtered: IWorkTimeModelEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.timekeepingWorkTimeModelDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.timekeepingWorkTimeModelDataService.refreshSelected().then(

		);
	}
}