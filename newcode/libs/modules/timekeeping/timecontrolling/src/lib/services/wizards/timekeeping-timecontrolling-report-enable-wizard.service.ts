/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingReportDataService } from '../timekeeping-time-controlling-report-data.service';


@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimecontrollingReportEnableWizardService extends BasicsSharedSimpleActionWizardService<IReportEntity>{

	private readonly timekeepingTimecontrollingReportDataService = inject(TimekeepingTimeControllingReportDataService);

	public onStartEnableWizard(): void {
		const doneMsg = 'timekeeping.recording.enableDone';
		const nothingToDoMsg = 'timekeeping.recording.alreadyEnabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IReportEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'CommentText',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};
		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IReportEntity[]{
		return this.timekeepingTimecontrollingReportDataService.getSelection();
	}

	public override filterToActionNeeded(selected: IReportEntity[]): IReportEntity[]{
		const filteredSelection: IReportEntity[] = [];
		// Filter out the selection needed
		selected.forEach(item => {
			if(item.IsLive){
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}


	public override performAction(filtered: IReportEntity[]): void{
		filtered.forEach(item => {
			item.IsLive = true;
			this.timekeepingTimecontrollingReportDataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.timekeepingTimecontrollingReportDataService.refreshSelected();
	}
}