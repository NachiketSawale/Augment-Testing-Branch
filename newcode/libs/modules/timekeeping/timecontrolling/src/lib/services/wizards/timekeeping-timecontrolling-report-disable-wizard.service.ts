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
export class TimekeepingTimecontrollingReportDisableWizardService extends BasicsSharedSimpleActionWizardService<IReportEntity>{

	private readonly dataService = inject(TimekeepingTimeControllingReportDataService);

	public onStartDisableWizard(): void {
		const doneMsg = 'timekeeping.recording.disableDone';
		const nothingToDoMsg = 'timekeeping.recording.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<IReportEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'CommentText',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg
		};

		this.startSimpleActionWizard(option);
	}


	public override getSelection(): IReportEntity[]{
		return this.dataService.getSelection();
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
			item.IsLive = false;
			this.dataService.setModified(item);
		});
	}


	public override postProcess(): void {
		this.dataService.refreshSelected();
	}
}