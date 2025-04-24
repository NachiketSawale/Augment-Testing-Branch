import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IWorkTimeModelEntity } from '../../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelDataService } from '../timekeeping-work-time-model-data.service';

@Injectable({
	providedIn: 'root'
})
export class TimekeepingWorkTimeModelEnableWizardService extends BasicsSharedSimpleActionWizardService<IWorkTimeModelEntity>{

	private readonly timekeepingWorkTimeModelDataService = inject(TimekeepingWorkTimeModelDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'timekeeping.common.enableDone';
		const nothingToDoMsg = 'timekeeping.common.timeSymbolAlreadyEnable';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IWorkTimeModelEntity> = {
			headerText: 'cloud.common.enableRecord',
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
			item.IsLive = true;
			this.timekeepingWorkTimeModelDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.timekeepingWorkTimeModelDataService.refreshSelected().then(

		);
	}
}