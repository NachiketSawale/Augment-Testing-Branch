import { inject, Injectable } from '@angular/core';
import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { ISchedulingCalendarEntity } from '@libs/scheduling/interfaces';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarDisableWizardService extends BasicsSharedSimpleActionWizardService<ISchedulingCalendarEntity>{

	private readonly schedulingCalendarDataService = inject(SchedulingCalendarDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'scheduling.calendar.disableCalendarDone';
		const nothingToDoMsg = 'scheduling.calendar.calendarAlreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<ISchedulingCalendarEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): ISchedulingCalendarEntity[]{
		return this.schedulingCalendarDataService.getSelection();
	}

	public override filterToActionNeeded(selected: ISchedulingCalendarEntity[]): ISchedulingCalendarEntity[]{
		const filteredSelection: ISchedulingCalendarEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if(item.IsLive){
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}


	public override performAction(filtered: ISchedulingCalendarEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = false;
			this.schedulingCalendarDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.schedulingCalendarDataService.refreshSelected().then(

		);
	}
}